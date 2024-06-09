const { enqueueTask } = require('../db/cache/utility/taskUtils');
const logger = require('../utilities/logger');
const socketManager = require('../handlers/utils/SocketManager');

const handleDisconnect = (socket, redisClient) => {
  if (socket.character && socket.character.id && socket.party && socket.party.id) {
    const taskData = { characterId: socket.character.id, partyId: socket.party.id };
    
    enqueueTask(redisClient, 'leaveParty', taskData, (response) => {
      if (response.success) {
        logger.debug(`Character ${socket.character.id} successfully left party ${socket.party.id} on disconnect.`);
        
        // Unregister the socket from the current party
        socketManager.unregisterSocket(socket.character.id);

        // Notify all remaining party members
        const partySockets = socketManager.getSocketsByPartyId(socket.party.id);
        partySockets.forEach(partySocket => {
          partySocket.emit('partyUpdate', {
            message: `${socket.character.name} has left the party.`,
            memberLeft: {
              id: socket.character.id,
              name: socket.character.name
            }
          });
        });
      } else {
        logger.error(`Failed to remove character ${socket.character.id} from party ${socket.party.id} on disconnect.`);
      }
    });

    enqueueTask(redisClient, 'cleanupBattle', taskData, (response) => {
      if (response.success) {
        logger.debug(`Cleaned up battles with ${socket.character.id} successfully on disconnect.`);
      } else {
        logger.error(`Failed to clean up battles for character ${socket.character.id} on disconnect.`);
      }
    });
  }
};

module.exports = {
  handleDisconnect,
};
