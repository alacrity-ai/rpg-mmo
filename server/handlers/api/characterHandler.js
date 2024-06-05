// handlers/api/characterHandler.js
const { enqueueTask } = require('../taskUtils');

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
    enqueueTask('loginCharacter', taskData, (response) => {
      if (response.success) {
        socket.character = {
          id: response.data.id,
          name: response.data.name
        };
      }
      callback(response);
    });
  });

  socket.on('classList', async (data, callback) => {
    enqueueTask('classList', {}, callback);
  });
};
