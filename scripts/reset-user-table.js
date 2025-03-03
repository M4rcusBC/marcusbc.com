/**
 * Script to reset the User table in the database
 * This script will:
 * 1. Connect to the database using config values
 * 2. Drop the existing User table if it exists
 * 3. Create a new User table based on the current User model schema
 */
require('dotenv').config();
const sequelize = require('../db');
const User = require('../models/User');
const config = require('../config/config');

// Print configuration being used (with password obscured)
const dbConfig = {
    ...config.db,
    password: '********' // Hide the actual password in logs
};
console.log('Using database configuration:', dbConfig);
console.log('Connection details:', config.db.options);

// Function to reset the User table
async function resetUserTable() {
    try {
        console.log('Connecting to database...');
        await sequelize.authenticate();
        console.log('Connection established successfully.');

        console.log('Dropping User table if exists and recreating it...');
        // Force sync will drop the table if it exists and then create a new one
        await User.sync({ force: true });

        console.log('Success! User table has been reset according to the current schema.');
        console.log('User schema now includes:');
        console.log('- id: Integer (auto-increment, primary key)');
        console.log('- username: String (unique, not null)');
        console.log('- credentialID: BLOB');
        console.log('- credentialPublicKey: BLOB');
        console.log('- credentialCounter: Integer (default: 0)');
        console.log('- currentChallenge: String');
        console.log('- createdAt: Date/Time');
        console.log('- updatedAt: Date/Time');

        return true;
    } catch (error) {
        console.error('Error resetting User table:', error);
        return false;
    } finally {
        // Close the database connection
        await sequelize.close();
        console.log('Database connection closed.');
    }
}

// Execute the reset function
resetUserTable().then((success) => {
    process.exit(success ? 0 : 1);
});