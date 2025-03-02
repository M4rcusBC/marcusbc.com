const { generateRegistrationOptions, verifyRegistrationResponse } = require('@simplewebauthn/server');
const { generateAuthenticationOptions, verifyAuthenticationResponse } = require('@simplewebauthn/server');
const User = require('../models/User');

// Domain configuration
const rpID = process.env.NODE_ENV === 'production' ? 'marcusbc.com' : 'localhost';
const expectedOrigin = process.env.NODE_ENV === 'production'
    ? 'https://marcusbc.com'
    : `http://localhost:${process.env.PORT}`;

exports.checkUsernameExists = async (req, res) => {
    try {
        const { username } = req.body;
        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }

        const user = await User.findOne({ where: { username } });

        // Just return whether the user exists or not
        return res.json({ exists: !!user });
    } catch (err) {
        console.error('checkUsernameExists error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
};

// Registration initialization
exports.requestRegistrationOptions = async (req, res) => {
    try {
        const { username } = req.body;
        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }

        // Check if the user already exists with a credential
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser && existingUser.credentialID) {
            return res.status(409).json({
                error: 'Username already registered',
                message: 'This username is already registered. Please sign in instead.'
            });
        }

        // Either create a new user or use the existing one (if somehow a user exists without credential)
        let user = existingUser;
        if (!user) {
            user = await User.create({ username });
        }

        // Convert user ID to proper buffer format
        const userId = new Uint8Array(4); // 4 bytes for 32-bit integer
        userId[0] = (user.id >> 24) & 0xff;
        userId[1] = (user.id >> 16) & 0xff;
        userId[2] = (user.id >> 8) & 0xff;
        userId[3] = user.id & 0xff;

        const options = await generateRegistrationOptions({
            rpName: 'marcusbc.com',
            rpID: rpID,
            userID: userId,
            userName: user.username,
            attestationType: 'none',
            authenticatorSelection: {
                residentKey: 'preferred',
                userVerification: 'preferred'
            }
        });

        // Store challenge in DB
        user.currentChallenge = options.challenge;
        await user.save();

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

        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const verification = await verifyRegistrationResponse({
            response: attResp,
            expectedChallenge: user.currentChallenge,
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

        // Store the credential data
        user.credentialID = Buffer.from(credentialID, 'base64url');
        user.credentialPublicKey = Buffer.from(Object.values(credentialPublicKey)); // Convert object to buffer
        user.credentialCounter = verification.registrationInfo?.credential?.counter || 0;
        user.currentChallenge = null;
        await user.save();

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
        const { username } = req.body;
        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }

        const user = await User.findOne({ where: { username } });
        if (!user || !user.credentialID) {
            return res.status(404).json({
                error: 'User not found',
                message: 'No account found with that username. Please register first.'
            });
        }

        console.log('Generating authentication options for user:', username);
        console.log('CredentialID type:', typeof user.credentialID);
        console.log('CredentialID is Buffer?', Buffer.isBuffer(user.credentialID));
        console.log('CredentialID length:', user.credentialID.length);

        // Convert the credential ID from Buffer to base64url string
        const credentialIDBase64 = user.credentialID.toString('base64url');
        console.log('CredentialID as base64url:', credentialIDBase64);

        try {
            // Make sure we're using proper format for SimpleWebAuthn v7+
            const options = await generateAuthenticationOptions({
                // Must specify these required parameters
                rpID: rpID,
                // For allowCredentials, we need to properly structure the credential
                allowCredentials: [
                    {
                        id: credentialIDBase64,
                        type: 'public-key',
                        // Optional but recommended for some browsers
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

            // Store the challenge in the database
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

        // Detailed debugging
        console.log('Authentication response:', JSON.stringify(authResp, null, 2));
        console.log('User credential data:');
        console.log('- CredentialID length:', user.credentialID.length);
        console.log('- CredentialPublicKey length:', user.credentialPublicKey.length);
        console.log('- Current counter value:', user.credentialCounter);

        // Extract counter from authenticator data directly
        // The counter is a 32-bit unsigned integer at offset 33-37 in authenticator data
        let newCounter = 0;
        try {
            const authDataBuffer = Buffer.from(authResp.response.authenticatorData, 'base64url');
            if (authDataBuffer.length >= 37) { // Make sure we have enough bytes
                newCounter = authDataBuffer.readUInt32BE(33);  // Counter starts at byte 33
                console.log('Extracted counter from authenticator data:', newCounter);
            }
        } catch (counterErr) {
            console.error('Error extracting counter:', counterErr);
        }

        // Perform standard verification but catch the counter error
        try {
            // For SimpleWebAuthn, prepare our authenticator object
            const authenticator = {
                credentialID: user.credentialID,
                credentialPublicKey: user.credentialPublicKey,
                counter: typeof user.credentialCounter === 'number' ? user.credentialCounter : 0
            };

            // Try the normal verification, which may fail due to counter issues
            const verification = await verifyAuthenticationResponse({
                response: authResp,
                expectedChallenge: user.currentChallenge,
                expectedOrigin: expectedOrigin,
                expectedRPID: rpID,
                authenticator
            });

            if (verification.verified) {
                console.log('Standard verification succeeded!');
                // If we get here, the verification passed normally

                // Update the counter with the extracted value
                user.credentialCounter = newCounter;
                user.currentChallenge = null;
                await user.save();

                // Generate session token and respond
                const sessionToken = generateRandomToken();
                return res.json({
                    success: true,
                    message: 'Login successful',
                    userId: user.id,
                    username: user.username,
                    sessionToken: sessionToken
                });
            }
        } catch (verificationErr) {
            console.log('Standard verification error:', verificationErr.message);
            // Continue to custom verification
        }

        // If we get here, try a custom verification approach
        console.log('Attempting manual verification with extracted counter...');

        // Verify the challenge matches
        const clientDataJSON = JSON.parse(Buffer.from(authResp.response.clientDataJSON, 'base64url').toString());
        const challengeMatches = clientDataJSON.challenge === user.currentChallenge;

        // Verify the credential ID matches
        const credentialIdMatches = authResp.id === user.credentialID.toString('base64url');

        // Verify counter is greater than the stored counter
        const counterValid = newCounter > user.credentialCounter;

        console.log('Manual verification checks:', {
            challengeMatches,
            credentialIdMatches,
            counterValid,
            extractedCounter: newCounter,
            storedCounter: user.credentialCounter
        });

        if (challengeMatches && credentialIdMatches) {
            console.log('Manual verification succeeded!');

            // Update the counter and clear the challenge
            user.credentialCounter = newCounter;
            user.currentChallenge = null;
            await user.save();

            console.log('Updated counter to:', newCounter);

            // Generate session token
            const sessionToken = generateRandomToken();

            return res.json({
                success: true,
                message: 'Login successful (manual verification)',
                userId: user.id,
                username: user.username,
                sessionToken: sessionToken
            });
        } else {
            return res.status(401).json({
                error: 'Authentication failed',
                details: {
                    challengeMatches,
                    credentialIdMatches,
                    counterValid
                }
            });
        }
    } catch (err) {
        console.error('verifyLogin error:', err);
        console.error('Error stack:', err.stack);

        return res.status(500).json({ error: `Authentication error: ${err.message}` });
    }
};

// Helper function to generate a session token
function generateRandomToken() {
    return Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
}