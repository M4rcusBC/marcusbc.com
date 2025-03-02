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
    credentialID: {
        type: DataTypes.BLOB,
        allowNull: true,
    },
    credentialPublicKey: {
        type: DataTypes.BLOB,
        allowNull: true,
    },
    credentialCounter: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    currentChallenge: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'users',
});

module.exports = User;