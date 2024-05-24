const { enqueueTask } = require('../../services/server/taskUtils');

module.exports = (socket) => {
  socket.on('login', async (data, callback) => {
    enqueueTask('login', data, callback);
  });

  socket.on('createAccount', async (data, callback) => {
    enqueueTask('createAccount', data, callback);
  });
};
