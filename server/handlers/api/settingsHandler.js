// handlers/api/settingsHandler.js

const { enqueueTask } = require('../taskUtils');

module.exports = (socket) => {
  socket.on('getServerSettings', async (data, callback) => {
    enqueueTask('getServerSettings', data, callback);
  });
};
