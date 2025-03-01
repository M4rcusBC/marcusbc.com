const nodemailer = require('nodemailer');
const config = require('../config/config');

// Create transporter
const transporter = nodemailer.createTransport({
    host: config.EMAIL_HOST,
    port: config.EMAIL_PORT,
    secure: config.EMAIL_PORT === 465,
    auth: {
        user: config.EMAIL_USER,
        pass: config.EMAIL_PASSWORD
    }
});

// Send verification email
exports.sendVerificationEmail = async (email, token) => {
    const verificationUrl = `${config.BASE_URL}/verify-email?token=${token}`;

    const mailOptions = {
        from: config.EMAIL_FROM,
        to: email,
        subject: 'Verify your email address',
        html: `
      <h1>Email Verification</h1>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
      <p>This link will expire in 24 hours.</p>
    `
    };

    return transporter.sendMail(mailOptions);
};

// Send password reset email
exports.sendPasswordResetEmail = async (email, token) => {
    const resetUrl = `${config.BASE_URL}/reset-password?token=${token}`;

    const mailOptions = {
        from: config.EMAIL_FROM,
        to: email,
        subject: 'Reset your password',
        html: `
      <h1>Password Reset</h1>
      <p>Please click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link will expire in 1 hour.</p>
    `
    };

    return transporter.sendMail(mailOptions);
};