const { Sequelize } = require('sequelize');

// Adjust these credentials for your environment
const sequelize = new Sequelize('my_db_name', 'my_user', 'my_password', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false, // true for debugging
});

module.exports = sequelize;