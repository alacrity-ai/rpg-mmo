// services/logoutCleanup.js

const { enqueueTask } = require('../handlers/taskUtils');
const logger = require('../utilities/logger');

const handleDisconnect = (socket) => {
  if (socket.character && socket.character.id && socket.party && socket.party.id) {
    const taskData = { characterId: socket.character.id, partyId: socket.party.id };
    enqueueTask('leaveParty', taskData, (response) => {
      if (response.success) {
        logger.info(`Character ${socket.character.id} successfully left party ${socket.party.id} on disconnect.`);
      } else {
        logger.error(`Failed to remove character ${socket.character.id} from party ${socket.party.id} on disconnect.`);
      }
    });
  }
};

module.exports = {
  handleDisconnect,
};
