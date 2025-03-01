const express = require('express');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const AppleStrategy = require('passport-apple');
const AzureADStrategy = require('passport-azure-ad').OIDCStrategy;
const GitHubStrategy = require('passport-github2').Strategy;
const authRoutes = require('./routes/auth');
const config = require('./config/config');
const User = require('./models/User');

const app = express();

// Connect to MongoDB
mongoose.connect(config.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session middleware
app.use(
    session({
        secret: config.JWT_SECRET,
        resave: false,
        saveUninitialized: true
    })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Serialize/deserialize user
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

/**
 * Apple OAuth
 */
passport.use(
    new AppleStrategy(
        {
            clientID: config.APPLE_CLIENT_ID,
            teamID: config.APPLE_TEAM_ID,
            keyID: config.APPLE_KEY_ID,
            privateKeyString: config.APPLE_PRIVATE_KEY,
            callbackURL: '/auth/apple/callback',
            scope: ['name', 'email']
        },
        async (accessToken, refreshToken, idToken, profile, done) => {
            try {
                // Check if user already exists
                let user = await User.findOne({
                    'oauthProfiles.provider': 'apple',
                    'oauthProfiles.id': profile.id
                });

                if (!user) {
                    // Create new user
                    user = new User({
                        name: profile.name?.firstName + ' ' + profile.name?.lastName,
                        email: profile.email,
                        isEmailVerified: true,
                        oauthProfiles: [{
                            provider: 'apple',
                            id: profile.id,
                            data: profile
                        }]
                    });
                    await user.save();
                }

                return done(null, user);
            } catch (error) {
                return done(error);
            }
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
            clientID: config.AZURE_CLIENT_ID,
            clientSecret: config.AZURE_CLIENT_SECRET,
            responseType: 'code',
            responseMode: 'query',
            redirectUrl: config.BASE_URL + '/auth/azure/callback'
        },
        async (issuer, sub, profile, accessToken, refreshToken, done) => {
            try {
                // Check if user already exists
                let user = await User.findOne({
                    'oauthProfiles.provider': 'azure',
                    'oauthProfiles.id': profile.oid
                });

                if (!user) {
                    // Create new user
                    user = new User({
                        name: profile.displayName,
                        email: profile.upn || profile.emails?.[0],
                        isEmailVerified: true,
                        oauthProfiles: [{
                            provider: 'azure',
                            id: profile.oid,
                            data: profile
                        }]
                    });
                    await user.save();
                }

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    )
);

/**
 * GitHub OAuth
 */
passport.use(
    new GitHubStrategy(
        {
            clientID: config.GITHUB_CLIENT_ID,
            clientSecret: config.GITHUB_CLIENT_SECRET,
            callbackURL: '/auth/github/callback'
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user already exists
                let user = await User.findOne({
                    'oauthProfiles.provider': 'github',
                    'oauthProfiles.id': profile.id
                });

                if (!user) {
                    // Create new user
                    user = new User({
                        name: profile.displayName,
                        email: profile.emails?.[0]?.value,
                        isEmailVerified: true,
                        oauthProfiles: [{
                            provider: 'github',
                            id: profile.id,
                            data: profile
                        }]
                    });
                    await user.save();
                }

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    )
);

// Auth API Routes
app.use('/api/auth', authRoutes);

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
    res.send(`Hello, ${req.user && req.user.name ? req.user.name : 'User'}!`);
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