const { enqueueTask } = require('../../services/server/taskUtils');

module.exports = (socket) => {
  socket.on('createCharacter', async (data, callback) => {
    if (!socket.user || !socket.user.id) {
      callback({ error: 'User not logged in.' });
      return;
    }
    const taskData = { userId: socket.user.id, ...data };
    enqueueTask('createCharacter', taskData, callback);
  });

  socket.on('loginCharacter', async (data, callback) => {
    enqueueTask('loginCharacter', data, callback);
  });
};
