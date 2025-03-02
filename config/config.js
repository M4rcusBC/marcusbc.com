require('dotenv').config();

module.exports = {
    db: {
        // Customize these values for your environment or use environment variables
        database: 'my_db_name',
        username: 'my_user',
        password: 'my_password',
        options: {
            host: process.env.DB_HOST,
            dialect: 'mysql',
            logging: false,
        },
    },
    server: {
        port: 3000,
    },
};