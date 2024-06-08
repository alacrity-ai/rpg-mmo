// handlers/api/settingsHandler.js

const { enqueueTask } = require('../../db/cache/utility/taskUtils');
const logger = require('../../utilities/logger');

module.exports = (socket, io, redisClient) => {
  socket.on('getServerSettings', async (data, callback) => {
    enqueueTask(redisClient, 'getServerSettings', data, callback);
  });
};
