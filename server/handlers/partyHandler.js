const { enqueueTask } = require('../db/cache/utility/taskUtils');
const socketManager = require('./utils/SocketManager');


module.exports = (socket, io, redisClient) => {
  socket.on('createParty', async (data, callback) => {
    if (!socket.character || !socket.character.id) {
      callback({ error: 'Character not logged in.' });
      return;
    }
    const taskData = { userId: socket.user.id, characterId: socket.character.id };
    enqueueTask(redisClient, 'createParty', taskData, (response) => {
      if (response.success) {
        // Update the socket with the new party ID
        socket.party = { id: response.data.partyId };
  
        // Register the socket with the new party ID in SocketManager
        socketManager.registerSocket(socket, socket.character.id, response.data.partyId);
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
    
    enqueueTask(redisClient, 'leaveParty', taskData, (response) => {
      if (response.success) {
        console.log('Response successful. Unregistering socket from party.');
        // Unregister the socket from the current party
        socketManager.unregisterSocket(socket.character.id);
  
        // Notify all remaining party members
        const partySockets = socketManager.getSocketsByPartyId(response.data.partyId);
        partySockets.forEach(partySocket => {
          partySocket.emit('partyUpdate', {
            message: `${socket.character.name} has left the party.`,
            memberLeft: {
              id: socket.character.id,
              name: socket.character.name
            }
          });
        });
  
        // Remove the party ID from the socket
        delete socket.party;
      } else {
        logger.error('Response failed:', response.error);
      }
      
      callback(response);
    });
  });

  socket.on('getParty', async (data, callback) => {
    if (!socket.character || !socket.character.id) {
      callback({ error: 'Character not logged in.' });
      return;
    }
    if (!socket.party || !socket.party.id) {
      callback({ error: 'Character is not in a party.' });
      return;
    }

    const taskData = { characterId: socket.character.id, partyId: socket.party.id};
    enqueueTask(redisClient, 'getParty', taskData, (response) => {
      callback(response);
    });
  });

  socket.on('inviteToParty', async (data, callback) => {
    if (!socket.character || !socket.character.id) {
      callback({ error: 'Character not logged in.' });
      return;
    }
    if (!socket.party || !socket.party.id) {
      callback({ error: 'Character is not in a party.' });
      return;
    }

    const taskData = { partyId: socket.party.id, invitedCharacterName: data.invitedCharacterName };

    if (!data.invitedCharacterName) {
      callback({ error: 'No character name provided.' });
      return;
    }

    if (data.invitedCharacterName === socket.character.name) {
      callback({ error: 'You cannot invite yourself to the party.' });
      return;
    }

    enqueueTask(redisClient, 'inviteToParty', taskData, (response) => {
      if (response.error) {
        callback(response);
        return;
      }
  
      // Get the id of the invited character
      const invitedCharacterId = response.data.character.id;
      
      // Find the socket of the invited character
      const invitedCharacterSocket = socketManager.getSocketByCharacterId(invitedCharacterId);
      if (invitedCharacterSocket) {
        // If the invited character's party ID is the same as the party ID of the inviter, they are already in the same party
        if (invitedCharacterSocket.party && invitedCharacterSocket.party.id === socket.party.id) {
          callback({ error: 'Character is already in the same party.' });
          return;
        }

        // Emit a notification to the invited character's socket
        invitedCharacterSocket.emit('partyInvite', {
          partyId: socket.party.id,
          invitedBy: socket.character.name, // You can include other info like inviter's name
          invitedCharacter: response.data.character // Include character data if needed
        });
      } else {
        callback({ error: 'Character is not online.' });
        return;
      }
  
      // Notify all party members of the new invitation
      const partySockets = socketManager.getSocketsByPartyId(socket.party.id);
      partySockets.forEach(partySocket => {
        partySocket.emit('partyUpdate', {
          message: `${data.invitedCharacterName} has been invited to the party.`,
          invitedCharacter: response.data.character // Include character data if needed
        });
      });
  
      // Respond to the client who sent the invite with the character object
      callback(response);
    });
  });

  socket.on('respondToPartyInvite', async (data, callback) => {
    if (!socket.character || !socket.character.id) {
      callback({ error: 'Character not logged in.' });
      return;
    }
    console.log('Got DATA: ', data);
    const taskData = { characterId: socket.character.id, partyId: data.partyId, userId: socket.user.id, accept: data.accept };
    enqueueTask(redisClient, 'respondToPartyInvite', taskData, (response) => {
      if (response.success && data.accept) {
        // Unregister the socket from the previous party if exists
        if (socket.party && socket.party.id) {
          socketManager.unregisterSocket(socket.character.id);
        }
  
        // Update the socket with the new party ID
        socket.party = { id: data.partyId };
  
        // Register the socket with the new party ID in SocketManager
        socketManager.registerSocket(socket, socket.character.id, data.partyId);
  
        // Notify all party members of the new member
        const partySockets = socketManager.getSocketsByPartyId(data.partyId);
        partySockets.forEach(partySocket => {
          partySocket.emit('partyUpdate', {
            message: `${socket.character.name} has joined the party.`,
            newMember: {
              id: socket.character.id,
              name: socket.character.name
            }
          });
        });
      }
      callback(response);
    });
  });
  
  
};
