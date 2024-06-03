require('dotenv').config();

const config = {
    db: {
        host: process.env.DB_HOST || '127.0.0.1',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'rootpassword',
        name: process.env.DB_NAME || 'testdb',
    },
    tokens: {
        workerToken: process.env.WORKER_TOKEN || 'default-worker-token',
        clientToken: process.env.CLIENT_TOKEN || 'default-client-token',
    },
    cooldowns: {
        minimum: parseInt(process.env.COOLDOWN_MINIMUM, 10) || 500,
        short: parseInt(process.env.COOLDOWN_SHORT, 10) || 1500,
        normal: parseInt(process.env.COOLDOWN_NORMAL, 10) || 2500,
        long: parseInt(process.env.COOLDOWN_LONG, 10) || 4500,
    },
    server: {
        port: process.env.PORT || 3000,
    },
};

module.exports = config;
