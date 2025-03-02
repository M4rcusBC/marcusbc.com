const { generateRegistrationOptions, verifyRegistrationResponse } = require('@simplewebauthn/server');
const { generateAuthenticationOptions, verifyAuthenticationResponse } = require('@simplewebauthn/server');
const User = require('../models/User');

// Domain configuration
const rpID = process.env.NODE_ENV === 'production' ? 'marcusbc.com' : 'localhost';
const expectedOrigin = process.env.NODE_ENV === 'production'
    ? 'https://marcusbc.com'
    : 'http://localhost:3000';

// Registration initialization
exports.requestRegistrationOptions = async (req, res) => {
    try {
        const { username } = req.body;
        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }

        // Look for existing user, else create
        let user = await User.findOne({ where: { username } });
        if (!user) {
            user = await User.create({ username });
        }

        const options = await generateRegistrationOptions({
            rpName: 'marcusbc.com',
            rpID: rpID,
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

        // Store verification data
        const { credentialID, credentialPublicKey } = verification.registrationInfo;

        user.credentialID = Buffer.from(credentialID);
        user.credentialPublicKey = Buffer.from(credentialPublicKey);
        user.credentialCounter = 0;
        user.currentChallenge = null;
        await user.save();

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
            return res.status(404).json({ error: 'User or credential not found' });
        }

        const options = generateAuthenticationOptions({
            allowCredentials: [
                {
                    id: user.credentialID,
                    type: 'public-key',
                },
            ],
            userVerification: 'preferred',
            rpID: rpID,
            timeout: 60000,
        });

        user.currentChallenge = options.challenge;
        await user.save();

        return res.json(options);
    } catch (err) {
        console.error('requestLoginOptions error:', err);
        return res.status(500).json({ error: 'Server error' });
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

        const verification = await verifyAuthenticationResponse({
            response: authResp,
            expectedChallenge: user.currentChallenge,
            expectedOrigin: expectedOrigin,
            expectedRPID: rpID,
            authenticator: {
                credentialPublicKey: user.credentialPublicKey,
                credentialID: user.credentialID,
                counter: user.credentialCounter,
            },
        });

        if (!verification.verified) {
            return res.status(400).json({ error: 'Login verification failed' });
        }

        // Update the counter to prevent replay attacks
        user.credentialCounter = verification.authenticationInfo.newCounter;
        user.currentChallenge = null;
        await user.save();

        // Generate session token
        const sessionToken = generateRandomToken();

        return res.json({
            success: true,
            message: 'Login successful',
            userId: user.id,
            username: user.username,
            sessionToken: sessionToken // Send the token to the client
        });
    } catch (err) {
        console.error('verifyLogin error:', err);
        return res.status(500).json({ error: `Server error: ${err.message}` });
    }
};

// Helper function to generate a session token
function generateRandomToken() {
    return Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
}