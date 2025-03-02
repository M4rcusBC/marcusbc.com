const express = require('express');
const sequelize = require('./db');
const webauthnRoutes = require('./routes/webauthn');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize and sync database
sequelize.sync()
    .then(() => console.log('MySQL DB synced'))
    .catch((err) => console.error('DB sync error:', err));

// Mount WebAuthn routes
app.use('/webauthn', webauthnRoutes);

// Default route - send public index.html
app.use(express.static('public'))
app.get('/'), (req, res) => {
    res.sendFile(__dirname + '/index.html');
}

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});