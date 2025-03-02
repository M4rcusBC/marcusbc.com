const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    // Option 1: Use auto-incrementing ID (recommended)
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    credentialID: {
        type: DataTypes.BLOB,
        allowNull: true
    },
    credentialPublicKey: {
        type: DataTypes.BLOB,
        allowNull: true
    },
    credentialCounter: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    currentChallenge: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    // Add these options to ensure timestamps work correctly
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
});

module.exports = User;