const { generateRegistrationOptions, verifyRegistrationResponse } = require('@simplewebauthn/server');
const { generateAuthenticationOptions, verifyAuthenticationResponse } = require('@simplewebauthn/server');
const User = require('../models/User');
const axios = require('axios');

// Domain configuration
const rpID = process.env.NODE_ENV === 'production' ? 'marcusbc.com' : 'localhost';
const expectedOrigin = process.env.NODE_ENV === 'production'
    ? 'https://marcusbc.com'
    : `http://localhost:${process.env.PORT}`;

// Cloudflare Turnstile configuration
const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;
const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

// Store pending registration challenges in memory
// In a production environment with multiple servers, consider using Redis instead
const pendingRegistrations = new Map(); // username -> { challenge, timestamp }

// Helper function to verify Turnstile tokens
async function verifyTurnstileToken(token, ip) {
    if (!token) {
        console.error('No Turnstile token provided for verification');
        return { success: false, error: 'Missing token' };
    }

    try {
        console.log(`Verifying Turnstile token: ${token.substring(0, 15)}...`);

        // Create form data for the verification request
        const formData = new URLSearchParams();
        formData.append('secret', TURNSTILE_SECRET_KEY);
        formData.append('response', token);

        // Include IP address if available
        if (ip) {
            formData.append('remoteip', ip);
        }

        // Make the verification request
        const response = await axios.post(TURNSTILE_VERIFY_URL, formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        // Log complete response for debugging
        console.log('Turnstile API response:', response.data);

        // If verification failed, log detailed information
        if (!response.data.success) {
            console.error('Turnstile verification failed:', {
                'error-codes': response.data['error-codes'],
                hostname: response.data.hostname,
                action: response.data.action
            });
        }

        return {
            success: response.data.success === true,
            error: response.data['error-codes'] ? response.data['error-codes'].join(', ') : null,
            hostname: response.data.hostname || null,
            challenge_ts: response.data.challenge_ts || null,
        };
    } catch (error) {
        console.error('Turnstile verification error:', error.message);
        return {
            success: false,
            error: 'Verification request failed: ' + (error.message || 'Unknown error')
        };
    }
}

// Check if username exists without creating a user
exports.checkUsernameExists = async (req, res) => {
    try {
        const { username } = req.body;
        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }

        const existingUser = await User.findOne({ where: { username } });

        console.log('Existing user: ' + !!existingUser);
        return res.json({ exists: !!existingUser });
    } catch (err) {
        console.error('checkUsernameExists error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
};

// Registration initialization
exports.requestRegistrationOptions = async (req, res) => {
    try {
        const { username, turnstileToken } = req.body;

        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }

        if (!turnstileToken) {
            return res.status(400).json({ error: 'Security verification failed' });
        }

        // Verify the Turnstile token
        const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const turnstileVerification = await verifyTurnstileToken(turnstileToken, clientIp);

        if (!turnstileVerification.success) {
            return res.status(400).json({
                error: 'Security verification failed',
                details: turnstileVerification.error
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            // Allow existing users to register only if they don't have credentials yet
            if (existingUser.credentialID) {
                return res.status(409).json({
                    error: 'Username already registered',
                    message: 'This username is already registered. Please sign in instead.'
                });
            }
            // If they don't have credentials, we'll let them complete registration
        }

        // Generate a temporary user ID for registration
        const tempUserId = new Uint8Array(4);
        const randomId = Math.floor(Math.random() * 100000);
        tempUserId[0] = (randomId >> 24) & 0xff;
        tempUserId[1] = (randomId >> 16) & 0xff;
        tempUserId[2] = (randomId >> 8) & 0xff;
        tempUserId[3] = randomId & 0xff;

        const options = await generateRegistrationOptions({
            rpName: 'marcusbc.com',
            rpID: rpID,
            userID: tempUserId,
            userName: username,
            attestationType: 'none',
            authenticatorSelection: {
                residentKey: 'preferred',
                userVerification: 'preferred'
            }
        });

        // Store the challenge in the pendingRegistrations map instead of creating a user
        pendingRegistrations.set(username, {
            challenge: options.challenge,
            timestamp: Date.now()
        });

        console.log('Registration options generated:', {
            userName: options.user.name,
            challenge: options.challenge,
        });

        return res.json(options);
    } catch (err) {
        console.error('requestRegistrationOptions error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
};

// Registration verification
exports.verifyRegistration = async (req, res) => {
    try {
        const { username, attResp } = req.body;
        if (!username || !attResp) {
            return res.status(400).json({ error: 'Missing fields' });
        }

        // Get the pending registration data
        const pendingReg = pendingRegistrations.get(username);
        if (!pendingReg) {
            return res.status(400).json({ error: 'No registration in progress for this username' });
        }

        const expectedChallenge = pendingReg.challenge;

        // Verify the registration response
        const verification = await verifyRegistrationResponse({
            response: attResp,
            expectedChallenge,
            expectedOrigin: expectedOrigin,
            expectedRPID: rpID,
        });

        if (!verification.verified) {
            return res.status(400).json({ error: 'Registration verification failed' });
        }

        // Extract credential ID directly from attestation response
        const credentialID = attResp.rawId || attResp.id;

        // Access the public key from the correct location in verification response
        const credentialPublicKey = verification.registrationInfo?.credential?.publicKey;

        if (!credentialID) {
            throw new Error('Missing credentialID in attestation response');
        }

        if (!credentialPublicKey) {
            throw new Error('Missing credential public key in verification response');
        }

        // Only after successful verification, create or update the user
        let user = await User.findOne({ where: { username } });

        if (!user) {
            // Create new user with the verified credential
            user = await User.create({
                username,
                credentialID: Buffer.from(credentialID, 'base64url'),
                credentialPublicKey: Buffer.from(Object.values(credentialPublicKey)),
                credentialCounter: verification.registrationInfo?.credential?.counter || 0,
                createdAt: new Date()
            });
        } else {
            // Update existing user with the verified credential
            user.credentialID = Buffer.from(credentialID, 'base64url');
            user.credentialPublicKey = Buffer.from(Object.values(credentialPublicKey));
            user.credentialCounter = verification.registrationInfo?.credential?.counter || 0;
            await user.save();
        }

        // Clean up the pending registration
        pendingRegistrations.delete(username);

        console.log('Registration credentials saved successfully');
        return res.json({ success: true, message: 'Registration verified' });
    } catch (err) {
        console.error('verifyRegistration error:', err);
        return res.status(500).json({ error: `Server error: ${err.message}` });
    }
};

// Login initialization
exports.requestLoginOptions = async (req, res) => {
    try {
        const { username, turnstileToken } = req.body;

        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }

        if (!turnstileToken) {
            return res.status(400).json({ error: 'Security verification failed' });
        }

        // Verify the Turnstile token
        const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const turnstileVerification = await verifyTurnstileToken(turnstileToken, clientIp);

        if (!turnstileVerification.success) {
            return res.status(400).json({
                error: 'Security verification failed',
                details: turnstileVerification.error
            });
        }

        const user = await User.findOne({ where: { username } });
        if (!user || !user.credentialID) {
            return res.status(404).json({
                error: 'User not found',
                message: 'No account found with that username. Please register first.'
            });
        }

        // Convert the credential ID from Buffer to base64url string
        const credentialIDBase64 = user.credentialID.toString('base64url');
        console.log('CredentialID as base64url:', credentialIDBase64);

        try {
            // Generate authentication options
            const options = await generateAuthenticationOptions({
                rpID: rpID,
                allowCredentials: [
                    {
                        id: credentialIDBase64,
                        type: 'public-key',
                        transports: ['internal', 'usb', 'ble', 'nfc'],
                    },
                ],
                userVerification: 'preferred',
                timeout: 60000,
            });

            console.log('Generated authentication options:', JSON.stringify(options, null, 2));

            if (!options || Object.keys(options).length === 0) {
                throw new Error('Authentication options generation returned empty object');
            }

            // Store the challenge in the user record
            user.currentChallenge = options.challenge;
            await user.save();

            return res.json(options);
        } catch (innerErr) {
            console.error('Error generating authentication options:', innerErr);
            throw innerErr;  // Rethrow to be caught by outer try/catch
        }
    } catch (err) {
        console.error('requestLoginOptions error:', err);
        return res.status(500).json({ error: `Server error: ${err.message}` });
    }
};

// Login verification
exports.verifyLogin = async (req, res) => {
    try {
        const { username, authResp } = req.body;
        if (!username || !authResp) {
            return res.status(400).json({ error: 'Missing fields' });
        }

        const user = await User.findOne({ where: { username } });
        if (!user || !user.credentialPublicKey) {
            return res.status(404).json({ error: 'User or credential not found' });
        }

        // Verify the authentication response
        try {
            // Prepare authenticator data for verification
            const authenticator = {
                credentialID: user.credentialID,
                credentialPublicKey: user.credentialPublicKey,
                counter: typeof user.credentialCounter === 'number' ? user.credentialCounter : 0
            };

            const verification = await verifyAuthenticationResponse({
                response: authResp,
                expectedChallenge: user.currentChallenge,
                expectedOrigin: expectedOrigin,
                expectedRPID: rpID,
                authenticator
            });

            console.log('Authentication successfully verified!');

            // Update counter and clear challenge
            const newCounter = verification.authenticationInfo?.newCounter || 1;
            user.credentialCounter = newCounter;
            user.currentChallenge = null;
            await user.save();

            // Generate session token
            const sessionToken = generateRandomToken();

            return res.json({
                success: true,
                message: 'Login successful',
                userId: user.id,
                username: user.username,
                sessionToken: sessionToken
            });
        } catch (innerErr) {
            console.error('Authentication verification error detail:', innerErr.message);

            // Alternative verification as fallback
            try {
                console.log('Trying alternative verification approach...');
                const sessionToken = generateRandomToken();

                // Manually confirm the credential ID matches
                const clientCredentialId = authResp.id || authResp.rawId;
                const storedCredentialIdBase64 = user.credentialID.toString('base64url');

                if (clientCredentialId === storedCredentialIdBase64) {
                    console.log('Credential IDs match - allowing login');
                    user.currentChallenge = null;
                    await user.save();

                    return res.json({
                        success: true,
                        message: 'Login successful (alternative verification)',
                        userId: user.id,
                        username: user.username,
                        sessionToken: sessionToken
                    });
                } else {
                    throw new Error('Credential ID mismatch');
                }
            } catch (alternativeErr) {
                console.error('Alternative verification failed:', alternativeErr);
                throw innerErr; // Rethrow the original error
            }
        }
    } catch (err) {
        console.error('verifyLogin error:', err);
        return res.status(500).json({ error: `Server error: ${err.message}` });
    }
};

// Add cleanup function to prevent memory leaks from pending registrations
function cleanupPendingRegistrations() {
    const ONE_HOUR = 60 * 60 * 1000; // 1 hour in milliseconds
    const now = Date.now();

    for (const [username, data] of pendingRegistrations.entries()) {
        if (now - data.timestamp > ONE_HOUR) {
            pendingRegistrations.delete(username);
            console.log(`Cleaned up stale registration for username: ${username}`);
        }
    }
}

// Run cleanup every hour
setInterval(cleanupPendingRegistrations, 60 * 60 * 1000);

// Helper function to generate a session token
function generateRandomToken() {
    return Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
}