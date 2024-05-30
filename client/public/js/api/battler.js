import socketManager from '../SocketManager';

// Get a specific battler
const getBattler = (battlerId) => {
  return new Promise((resolve, reject) => {
    socketManager.getSocket().emit('getBattler', { battlerId }, (response) => {
      if (response.error) {
        reject(response.error);
      } else {
        resolve(response.data);
      }
    });
  });
};

// Check if a battler can act
const canBattlerAct = (battlerId) => {
  return new Promise((resolve, reject) => {
    socketManager.getSocket().emit('canBattlerAct', { battlerId }, (response) => {
      if (response.error) {
        reject(response.error);
      } else {
        resolve(response.data);
      }
    });
  });
};

export default {
  getBattler,
  canBattlerAct,
};
