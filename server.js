const express = require('express');
const session = require('express-session');
const passport = require('passport');
const AppleStrategy = require('passport-apple');
const AzureADStrategy = require('passport-azure-ad').OIDCStrategy;
const GitHubStrategy = require('passport-github2').Strategy;

const app = express();

// Session middleware
app.use(
    session({
        secret: 'YOUR_SESSION_SECRET',
        resave: false,
        saveUninitialized: true
    })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Serialize/deserialize user
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

/**
 * Apple OAuth
 */
passport.use(
    new AppleStrategy(
        {
            clientID: 'YOUR_APPLE_CLIENT_ID',
            teamID: 'YOUR_APPLE_TEAM_ID',
            keyID: 'YOUR_APPLE_KEY_ID',
            privateKeyString: '-----BEGIN PRIVATE KEY-----\\nYOUR_APPLE_PRIVATE_KEY\\n-----END PRIVATE KEY-----',
            callbackURL: '/auth/apple/callback',
            scope: ['name', 'email']
        },
        (accessToken, refreshToken, idToken, profile, done) => {
            return done(null, profile);
        }
    )
);

/**
 * Microsoft (Azure AD)
 */
passport.use(
    new AzureADStrategy(
        {
            identityMetadata: 'https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration',
            clientID: 'YOUR_AZUREAD_CLIENT_ID',
            clientSecret: 'YOUR_AZUREAD_CLIENT_SECRET',
            responseType: 'code',
            responseMode: 'query',
            redirectUrl: 'https://marcusbc.com/auth/azure/callback' // update as needed
        },
        (issuer, sub, profile, accessToken, refreshToken, done) => {
            return done(null, profile);
        }
    )
);

/**
 * GitHub OAuth
 */
passport.use(
    new GitHubStrategy(
        {
            clientID: 'YOUR_GITHUB_CLIENT_ID',
            clientSecret: 'YOUR_GITHUB_CLIENT_SECRET',
            callbackURL: '/auth/github/callback'
        },
        (accessToken, refreshToken, profile, done) => {
            return done(null, profile);
        }
    )
);

/**
 * Remove the inline /login route since we’ll present the login options from the frontend modal.
 */

// Apple Routes
app.get('/auth/apple', passport.authenticate('apple'));
app.post(
    '/auth/apple/callback',
    passport.authenticate('apple', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/protected');
    }
);

// Microsoft (Azure) Routes
app.get('/auth/azure', passport.authenticate('azuread-openidconnect', { failureRedirect: '/' }));
app.get(
    '/auth/azure/callback',
    passport.authenticate('azuread-openidconnect', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/protected');
    }
);

// GitHub Routes
app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));
app.get(
    '/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/protected');
    }
);

// Protected
app.get('/protected', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/');
    }
    res.send(`Hello, ${req.user && req.user.displayName ? req.user.displayName : 'User'}!`);
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