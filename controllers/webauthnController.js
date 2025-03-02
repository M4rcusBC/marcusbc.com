const { generateRegistrationOptions, verifyRegistrationResponse } = require('@simplewebauthn/server');
const { generateAuthenticationOptions, verifyAuthenticationResponse } = require('@simplewebauthn/server');
const User = require('../models/User');

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
            // No need to specify ID - it will be auto-incremented
        }

        const options = await generateRegistrationOptions({
            rpName: 'marcusbc.com',
            userName: user.username,
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
            expectedOrigin: 'http://localhost:3000', // Adjust for production
            expectedRPID: 'localhost',             // Adjust for production
        });

        if (!verification.verified) {
            return res.status(400).json({ error: 'Registration verification failed' });
        }

        // If verified, store credentialPublicKey
        user.credentialPublicKey = verification.registrationInfo.credentialPublicKey;
        user.currentChallenge = null;
        await user.save();

        return res.json({ success: true, message: 'Registration verified' });
    } catch (err) {
        console.error('verifyRegistration error:', err);
        return res.status(500).json({ error: 'Server error' });
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
        if (!user || !user.credentialPublicKey) {
            return res.status(404).json({ error: 'User or credential not found' });
        }

        const options = generateAuthenticationOptions({
            allowCredentials: [
                {
                    id: user.credentialPublicKey, // This is your credential ID in a real scenario
                    type: 'public-key',
                },
            ],
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
            expectedOrigin: 'http://localhost:3000',
            expectedRPID: 'localhost',
            authenticator: {
                credentialPublicKey: user.credentialPublicKey,
                counter: 0, // In production, track the real counter to avoid replay attacks
            },
        });

        if (!verification.verified) {
            return res.status(400).json({ error: 'Login verification failed' });
        }

        // Clear challenge
        user.currentChallenge = null;
        await user.save();

        return res.json({
            success: true,
            message: 'Login successful',
            userId: user.id,
            username: user.username
        });
    } catch (err) {
        console.error('verifyLogin error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
};