// services/logoutCleanup.js

const { enqueueTask } = require('../handlers/taskUtils');
const logger = require('../utilities/logger');

const handleDisconnect = (socket, redisClient) => {
  if (socket.character && socket.character.id && socket.party && socket.party.id) {
    const taskData = { characterId: socket.character.id, partyId: socket.party.id };
    
    enqueueTask(redisClient, 'leaveParty', taskData, (response) => {
      if (response.success) {
        logger.debug(`Character ${socket.character.id} successfully left party ${socket.party.id} on disconnect.`);
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
