const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const emailService = require('../services/emailService');
const smsService = require('../services/smsService');
const config = require('../config/config');

// Generate random token
const generateToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

// Generate numeric verification code
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Register with email
exports.registerEmail = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password, name } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Create verification token
        const verificationToken = generateToken();
        const tokenExpires = new Date();
        tokenExpires.setHours(tokenExpires.getHours() + 1); // 1 hour expiry

        // Create user
        user = new User({
            email,
            password,
            name,
            verificationTokens: {
                email: {
                    token: verificationToken,
                    expires: tokenExpires
                }
            }
        });

        await user.save();

        // Send verification email
        await emailService.sendVerificationEmail(email, verificationToken);

        res.json({ success: true, message: 'Registration successful. Please check your email to verify your account.\nNote that this token expires in 1 hour.' });
    } catch (error) {
        console.error('Register email error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Register with phone
exports.registerPhone = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { phoneNumber, password, name } = req.body;

        // Check if user exists
        let user = await User.findOne({ phoneNumber });
        if (user) {
            return res.status(400).json({ message: 'Phone number already registered' });
        }

        // Create verification code
        const verificationCode = generateVerificationCode();
        const codeExpires = new Date();
        codeExpires.setMinutes(codeExpires.getMinutes() + 10); // 10 minutes expiry

        // Create user
        user = new User({
            phoneNumber,
            password,
            name,
            verificationTokens: {
                phone: {
                    token: verificationCode,
                    expires: codeExpires
                }
            }
        });

        await user.save();

        // Send verification SMS
        await smsService.sendVerificationSMS(phoneNumber, verificationCode);

        res.json({ success: true, message: 'Registration successful. Please enter the verification code sent to your phone.' });
    } catch (error) {
        console.error('Register phone error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Verify email
exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;

        const user = await User.findOne({
            'verificationTokens.email.token': token,
            'verificationTokens.email.expires': { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired verification token' });
        }

        user.isEmailVerified = true;
        user.verificationTokens.email = undefined;
        await user.save();

        res.json({ success: true, message: 'Email verified successfully' });
    } catch (error) {
        console.error('Verify email error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Verify phone
exports.verifyPhone = async (req, res) => {
    try {
        const { phoneNumber, code } = req.body;

        const user = await User.findOne({
            phoneNumber,
            'verificationTokens.phone.token': code,
            'verificationTokens.phone.expires': { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired verification code' });
        }

        user.isPhoneVerified = true;
        user.verificationTokens.phone = undefined;
        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id },
            config.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            success: true,
            message: 'Phone verified successfully',
            token
        });
    } catch (error) {
        console.error('Verify phone error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Login with email
exports.loginEmail = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (!user.isEmailVerified) {
            return res.status(400).json({ message: 'Please verify your email first' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id },
            config.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login email error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Login with phone
exports.loginPhone = async (req, res) => {
    try {
        const { phoneNumber } = req.body;

        const user = await User.findOne({ phoneNumber });
        if (!user) {
            return res.status(400).json({ message: 'Phone number not registered' });
        }

        // Create verification code
        const verificationCode = generateVerificationCode();
        const codeExpires = new Date();
        codeExpires.setMinutes(codeExpires.getMinutes() + 10); // 10 minutes expiry

        user.verificationTokens.phone = {
            token: verificationCode,
            expires: codeExpires
        };

        await user.save();

        // Send verification SMS
        await smsService.sendVerificationSMS(phoneNumber, verificationCode);

        res.json({
            success: true,
            message: 'Verification code sent to your phone',
            requiresVerification: true
        });
    } catch (error) {
        console.error('Login phone error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Forgot password
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create reset token
        const resetToken = generateToken();
        const tokenExpires = new Date();
        tokenExpires.setHours(tokenExpires.getHours() + 1); // 1 hour expiry

        user.verificationTokens.passwordReset = {
            token: resetToken,
            expires: tokenExpires
        };

        await user.save();

        // Send password reset email
        await emailService.sendPasswordResetEmail(email, resetToken);

        res.json({ success: true, message: 'Password reset link sent to your email' });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Reset password
exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        const user = await User.findOne({
            'verificationTokens.passwordReset.token': token,
            'verificationTokens.passwordReset.expires': { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        user.password = newPassword;
        user.verificationTokens.passwordReset = undefined;
        await user.save();

        res.json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};