import socketManager from '../SocketManager';

// Add a battler action
const addBattlerAction = (battleInstanceId, battlerId, actionType, actionData) => {
  console.log('Received inputs:', battleInstanceId, battlerId, actionType, actionData)
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
