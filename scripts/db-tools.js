/**
 * Database utility tools
 * Provides various database management functions accessible via CLI
 */
require('dotenv').config();
const { program } = require('commander');
const sequelize = require('../db');
const User = require('../models/User');
const config = require('../config/config');

// Define the CLI program
program
    .version('1.0.0')
    .description('Database utility tools for marcusbc.com');

// Command to reset User table
program
    .command('reset-users')
    .description('Reset the User table to match the current schema')
    .action(async () => {
        try {
            console.log('Connecting to database...');
            await sequelize.authenticate();
            console.log('Connection established successfully.');

            console.log('Dropping User table if exists and recreating it...');
            await User.sync({ force: true });

            console.log('Success! User table has been reset according to the current schema.');
            process.exit(0);
        } catch (error) {
            console.error('Error:', error);
            process.exit(1);
        } finally {
            await sequelize.close();
        }
    });

// Command to show current tables
program
    .command('show-tables')
    .description('Show all tables in the database')
    .action(async () => {
        try {
            console.log('Retrieving database tables...');
            const [results] = await sequelize.query('SHOW TABLES');
            console.log('Tables in database:');
            results.forEach((row, i) => {
                const tableName = Object.values(row)[0];
                console.log(`${i+1}. ${tableName}`);
            });
            process.exit(0);
        } catch (error) {
            console.error('Error:', error);
            process.exit(1);
        } finally {
            await sequelize.close();
        }
    });

// Command to check DB connection
program
    .command('test-connection')
    .description('Test the database connection')
    .action(async () => {
        try {
            console.log('Testing database connection...');
            await sequelize.authenticate();
            console.log('Database connection successful!');
            process.exit(0);
        } catch (error) {
            console.error('Connection error:', error);
            process.exit(1);
        } finally {
            await sequelize.close();
        }
    });

// Parse arguments
program.parse(process.argv);

// If no arguments, show help
if (!process.argv.slice(2).length) {
    program.outputHelp();
}