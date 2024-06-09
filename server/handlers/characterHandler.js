const { enqueueTask } = require('../db/cache/utility/taskUtils');
const socketManager = require('./utils/SocketManager'); // Adjust the import path if necessary

module.exports = (socket, io, redisClient) => {
  socket.on('characterList', async (data, callback) => {
    const userId = socket.user.id;
    enqueueTask(redisClient, 'characterList', { userId }, callback);
  });

  socket.on('createCharacter', async (data, callback) => {
    if (!socket.user || !socket.user.id) {
      callback({ error: 'User not logged in.' });
      return;
    }
    const taskData = { userId: socket.user.id, ...data };
    enqueueTask(redisClient, 'createCharacter', taskData, callback);
  });

  socket.on('loginCharacter', async (data, callback) => {
    if (!socket.user || !socket.user.id) {
      callback({ error: 'User not logged in.' });
      return;
    }

    const taskData = { userId: socket.user.id, ...data };
    enqueueTask(redisClient, 'loginCharacter', taskData, (response) => {
      if (response.success) {
        const characterId = response.data.id;
        
        // Check if the character is already logged in
        if (socketManager.getSocketByCharacterId(characterId)) {
          callback({ error: 'Character already logged in.' });
          return;
        }

        socket.character = {
          id: characterId,
          name: response.data.name
        };
        // Register the socket with the character ID in SocketManager
        socketManager.registerSocket(socket, socket.character.id);
      }
      callback(response);
    });
  });

  socket.on('classList', async (data, callback) => {
    enqueueTask(redisClient, 'classList', {}, callback);
  });

  socket.on('disconnect', () => {
    if (socket.character && socket.character.id) {
      // Unregister the socket from SocketManager when the socket disconnects
      socketManager.unregisterSocket(socket.character.id);
    }
  });
};
