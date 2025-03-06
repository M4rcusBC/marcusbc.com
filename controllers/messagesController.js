const nodemailer = require('nodemailer');
const axios = require('axios');

// Verifying Turnstile token function
async function verifyTurnstileToken(token, remoteip) {
    try {
        const response = await axios.post(
            'https://challenges.cloudflare.com/turnstile/v0/siteverify',
            new URLSearchParams({
                secret: process.env.TURNSTILE_SECRET_KEY,
                response: token,
                remoteip
            }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );
        return response.data.success;
    } catch (err) {
        console.error('[Turnstile verify error]', err);
        return false;
    }
}

exports.sendMessage = async (req, res) => {
    try {
        const turnstileToken = req.body['cf-turnstile-response'];
        const ip = req.ip || req.connection.remoteAddress;
        const isValidToken = await verifyTurnstileToken(turnstileToken, ip);

        if (!isValidToken) {
            return res.status(400).json({ error: 'Invalid Turnstile token' });
        }

        const { name, contactMethod, subject, message } = req.body;

        if (!name || !contactMethod || !subject || !message) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const transporter = nodemailer.createTransport({
            host: 'smtp.mail.me.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.APPLE_MAIL_USER,
                pass: process.env.APPLE_MAIL_APP_PASSWORD
            }
        });

        const mailOptions = {
            from: `"My Contact Page" <${process.env.APPLE_MAIL_USER}>`,
            to: process.env.CONTACT_DESTINATION_EMAIL,
            subject: `New message from ${name} (${subject})`,
            text: `
Name: ${name}
Contact Method: ${contactMethod}
Subject: ${subject}

Message:
${message}
`,
            html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Contact Method:</strong> ${contactMethod}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ success: true, message: 'Message sent via email successfully' });
    } catch (error) {
        console.error('[Message Controller Error]', error);
        return res.status(500).json({ error: 'Failed to process message' });
    }
};