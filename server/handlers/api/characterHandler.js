const { createCharacter, getCharacterByName } = require('../../db/queries/characterQueries');

module.exports = (socket) => {
  socket.on('createCharacter', async (data, callback) => {
    const { characterName, characterClass } = data;
    console.log('characterName:', characterName, 'characterClass:', characterClass);
    try {
      const character = await createCharacter(socket.user.id, characterName, characterClass);
      callback({ success: true, data: character });
    } catch (error) {
      callback({ error: 'Failed to create character. ' + error.message });
    }
  });

  socket.on('characterLogin', async (data, callback) => {
    const { characterName } = data;

    try {
      const character = await getCharacterByName(characterName);
      if (character) {
        callback({ success: true, data: character });
      } else {
        callback({ error: 'Character not found.' });
      }
    } catch (error) {
      callback({ error: 'Character login failed. ' + error.message });
    }
  });
};
