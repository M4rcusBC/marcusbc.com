const express = require('express');
const sequelize = require('./db');
const webauthnRoutes = require('./routes/webauthn');
const messagesRoutes = require('./routes/messages');
const session = require("express-session");
const config = require("./config/config");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: process.env.SESSION_SECRET || 'changeme-use-strong-secret-in-production',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 2 // 2 hours
    }
}));

// Initialize and sync database
sequelize.sync()
    .then(() => console.log('MySQL DB synced'))
    .catch((err) => console.error('DB sync error:', err));

console.log(process.env.NODE_ENV);

// Mount WebAuthn routes
app.use('/webauthn', webauthnRoutes);
app.use('/messages', messagesRoutes);
app.use('/cc', express.static('~/CyberChef'));

// Default route - send public index.html
app.use(express.static('public'));
app.get('/'), (req, res) => {
    res.sendFile(__dirname + '/index.html');
}

// Start server
const PORT = process.env.PORT || config.server.port;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});