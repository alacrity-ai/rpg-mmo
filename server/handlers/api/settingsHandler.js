// handlers/api/settingsHandler.js

const { enqueueTask } = require('../taskUtils');
const logger = require('../../utilities/logger');

module.exports = (socket, io, redisClient) => {
  socket.on('getServerSettings', async (data, callback) => {
    enqueueTask(redisClient, 'getServerSettings', data, callback);
  });
};
