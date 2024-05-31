import socketManager from '../SocketManager';

// Add a battler action
// battleInstanceId: The ID of the battle instance
// battlerId: The ID of the battler
// actionType: The type of action to add (e.g. 'move', 'ability', 'item')
// actionData: Additional data for the action
const addBattlerAction = (battleInstanceId, battlerId, actionType, actionData) => {
  return new Promise((resolve, reject) => {
    socketManager.getSocket().emit('addBattlerAction', { battleInstanceId, battlerId, actionType, actionData }, (response) => {
      if (response.error) {
        reject(response.error);
      } else {
        resolve(response.data);
      }
    });
  });
};

export default {
  addBattlerAction
};
