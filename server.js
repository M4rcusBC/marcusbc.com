const express = require('express');
const session = require('express-session');
const passport = require('passport');
// Keep these imports for later when you restore OAuth
const mongoose = require('mongoose');
const config = require('./config/config');

// Create a simple memory store for users during debugging
const memoryUsers = {};

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session middleware
app.use(
    session({
        secret: config.JWT_SECRET || 'temporary-secret',
        resave: false,
        saveUninitialized: true
    })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Modified serialize/deserialize user to work without MongoDB
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
    // Use in-memory user store instead of database for now
    done(null, memoryUsers[id]);
});

app.post('/api/auth/login/email', (req, res) => {
    const { email } = req.body;
    const userId = Date.now().toString();
    const user = {
        id: userId,
        name: email || 'Email User'
    };

    memoryUsers[userId] = user;

    req.login(user, (err) => {
        if (err) {
            console.error('Email login error:', err);
            return res.status(500).send('Login failed');
        }
        return res.redirect('/protected');
    });
});

app.post('/api/auth/login/phone', (req, res) => {
    const { phone } = req.body;
    const userId = Date.now().toString();
    const user = {
        id: userId,
        name: phone || 'Phone User'
    };

    memoryUsers[userId] = user;

    req.login(user, (err) => {
        if (err) {
            console.error('Phone login error:', err);
            return res.status(500).send('Login failed');
        }
        return res.redirect('/protected');
    });
});

// Status check endpoint for debugging
app.get('/api/auth/status', (req, res) => {
    if (req.isAuthenticated()) {
        return res.json({
            isAuthenticated: true,
            user: {
                name: req.user.name || req.user.username || 'User',
                id: req.user.id
            }
        });
    } else {
        return res.json({ isAuthenticated: false });
    }
});

// Protected route
app.get('/protected', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/');
    }
    res.send(`Hello, ${req.user?.name ? req.user.name : 'User'}!`);
});

// Logout
app.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
});

// Default route - send public index.html
app.use(express.static('public'));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});