require('dotenv').config();

module.exports = {
    db: {
        // Customize these values for your environment or use environment variables
        database: process.env.DB_NAME,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PWD,
        options: {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            dialect: 'mysql',
            logging: false,
        },
    },
    server: {
        port: process.env.SERVER_PORT,
    },
};
