const { DataTypes } = require('sequelize');
const sequelize = require('../db');

// "User" model for storing user data
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
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