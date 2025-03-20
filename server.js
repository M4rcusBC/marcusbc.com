const express = require('express');
const sequelize = require('./db');
const webauthnRoutes = require('./routes/webauthn');
const messagesRoutes = require('./routes/messages');
const session = require("express-session");
const dotenv = require('dotenv')
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const config = require("./config/config");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Create sequelize store
const sessionStore = new SequelizeStore({
    db: sequelize,
    tableName: 'sessions', // You can customize the table name
    checkExpirationInterval: 15 * 60 * 1000, // Clean up expired sessions every 15 minutes
    expiration: 2 * 60 * 60 * 1000  // Session expiration (2 hours)
});

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 2 * 60 * 60 * 1000 // 2 hours
    }
}));

// Initialize database and create the sessions table
sequelize.sync()
    .then(() => {
        console.log('MySQL DB synced');
        // Sync session store
        return sessionStore.sync();
    })
    .then(() => {
        console.log('Session store synced');
    })
    .catch((err) => console.error('DB sync error:', err));

console.log(process.env.NODE_ENV);

// Mount WebAuthn routes
app.use('/webauthn', webauthnRoutes);
app.use('/messages', messagesRoutes);
app.use('/cc', express.static('~/CyberChef'));

// Default route - serve static files from public directory
app.use(express.static('public'));

// Fix the syntax error in your catch-all route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Start server
const PORT = process.env.PORT || config.server.port;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});