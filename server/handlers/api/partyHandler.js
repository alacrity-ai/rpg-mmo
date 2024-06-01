const { enqueueTask } = require('../../services/server/taskUtils');

module.exports = (socket) => {
  socket.on('createParty', async (data, callback) => {
    data = { ...data, characterId: socket.character.id, userId: socket.user.id };
    enqueueTask('createParty', data, callback);
  });
};
