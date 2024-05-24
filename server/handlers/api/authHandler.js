const { enqueueTask } = require('../../services/server/taskUtils');

module.exports = (socket) => {
  socket.on('login', async (data, callback) => {
    enqueueTask('login', data, (response) => {
      if (response.success) {
        socket.user = { id: response.data.id }; // Attach user ID to the socket
      }
      callback(response);
    });
  });

  socket.on('createAccount', async (data, callback) => {
    enqueueTask('createAccount', data, callback);
  });
};
