require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
    try {
        // Get the turnstile token from the request
        const turnstileResponse = req.body['cf-turnstile-response'];

        if (!turnstileResponse) {
            return res.json({
                success: false,
                error: 'Turnstile token missing'
            });
        }

        // Verify the token with Cloudflare
        const verificationResponse = await fetch(
            'https://challenges.cloudflare.com/turnstile/v0/siteverify',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    secret: process.env.TURNSTILE_SECRET_KEY,
                    response: turnstileResponse,
                    remoteip: req.ip,
                }),
            }
        );

        const verificationResult = await verificationResponse.json();

        if (!verificationResult.success) {
            return res.json({
                success: false,
                error: 'Turnstile verification failed'
            });
        }

        // Process the form data - example: log it
        console.log('Form submission:', req.body);

        // Here you would typically send an email, save to database, etc.
        // For example, you might want to use a package like nodemailer to send emails

        return res.json({
            success: true,
            message: 'Form submitted successfully!'
        });
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({
            success: false,
            error: 'Server error occurred'
        });
    }
});

// For any other routes, serve the index.html file (SPA support)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});