const { enqueueTask } = require('../../services/server/taskUtils');

module.exports = (socket) => {
  socket.on('characterList', async (data, callback) => {
    const userId = socket.user.id;
    enqueueTask('characterList', { userId }, callback);
  });

  socket.on('createCharacter', async (data, callback) => {
    if (!socket.user || !socket.user.id) {
      callback({ error: 'User not logged in.' });
      return;
    }
    const taskData = { userId: socket.user.id, ...data };
    enqueueTask('createCharacter', taskData, callback);
  });

  socket.on('loginCharacter', async (data, callback) => {
    if (!socket.user || !socket.user.id) {
      callback({ error: 'User not logged in.' });
      return;
    }
    const taskData = { userId: socket.user.id, ...data };
    enqueueTask('loginCharacter', taskData, callback);
  });
};
