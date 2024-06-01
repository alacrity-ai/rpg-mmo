const { enqueueTask } = require('../../services/server/taskUtils');

module.exports = (socket) => {
  socket.on('getServerSettings', async (data, callback) => {
    enqueueTask('getServerSettings', data, callback);
  });
};
