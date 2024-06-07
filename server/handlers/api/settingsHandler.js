// handlers/api/settingsHandler.js

const { enqueueTask } = require('../taskUtils');
const logger = require('../../utilities/logger');

module.exports = (socket) => {
  socket.on('getServerSettings', async (data, callback) => {
    enqueueTask('getServerSettings', data, callback);
  });
};
