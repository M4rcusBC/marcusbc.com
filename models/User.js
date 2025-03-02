const { DataTypes } = require('sequelize');
const sequelize = require('../db');

// “User” model for storing user data
const User = sequelize.define('User', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
    },
    // Store an array of credentials in your production setup;
    // for simplicity, we'll keep just one credentialPublicKey here.
    credentialPublicKey: {
        type: DataTypes.BLOB,
        allowNull: true,
    },
    currentChallenge: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'users',
});

module.exports = User;