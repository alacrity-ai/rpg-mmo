const { enqueueTask } = require('../taskUtils');
const { handleDisconnect } = require('../../services/logoutCleanup');
const logger = require('../../utilities/logger');

module.exports = (socket, io, redisClient) => {
  socket.on('login', async (data, callback) => {
    enqueueTask(redisClient, 'login', data, (response) => {
      if (response.success) {
        socket.user = { id: response.data.id }; // Attach user ID to the socket
      }
      callback(response);
    });
  });

  socket.on('createAccount', async (data, callback) => {
    enqueueTask(redisClient, 'createAccount', data, callback);
  });

  socket.on('disconnect', () => {
    try {
      logger.info('A user disconnected');
      handleDisconnect(socket, redisClient);
    } catch (error) {
      logger.error(`Error during disconnect: ${error.message}`);
    }
  });
};
