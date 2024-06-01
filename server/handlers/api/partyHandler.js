const { enqueueTask } = require('../../services/server/taskUtils');

module.exports = (socket) => {
  socket.on('createParty', async (data, callback) => {
    if (!socket.character || !socket.character.id) {
      callback({ error: 'Character not logged in.' });
      return;
    }
    const taskData = { userId: socket.user.id, characterId: socket.character.id };
    enqueueTask('createParty', taskData, (response) => {
      if (response.success) {
        socket.party = { id: response.data.partyId };
      }
      callback(response);
    });
  });

  socket.on('leaveParty', async (data, callback) => {
    if (!socket.character || !socket.character.id) {
      callback({ error: 'Character not logged in.' });
      return;
    }
    if (!socket.party || !socket.party.id) {
      callback({ error: 'Character is not in a party.' });
      return;
    }
    const taskData = { characterId: socket.character.id, partyId: socket.party.id };
    enqueueTask('leaveParty', taskData, (response) => {
      if (response.success) {
        delete socket.party;
      }
      callback(response);
    });
  });
};
