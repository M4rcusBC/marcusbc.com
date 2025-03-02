require('dotenv').config();

module.exports = {
    db: {
        // Customize these values for your environment or use environment variables
        database: 'marcusbccom_alsohalldo',
        username: 'marcusbccom_alsohalldo',
        password: 'fc37311dec7c2b32f63994b70f916aa6497d8fb0',
        options: {
            host: 'j455o.h.filess.io',
            port: 3307,
            dialect: 'mysql',
            logging: false,
        },
    },
    server: {
        port: 2876,
    },
};