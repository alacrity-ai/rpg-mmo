import socketManager from '../SocketManager';

// Get a specific battle
const getBattle = (battleId) => {
  return new Promise((resolve, reject) => {
    socketManager.getSocket().emit('getBattle', { battleId }, (response) => {
      if (response.error) {
        reject(response.error);
      } else {
        resolve(response.data);
      }
    });
  });
};

// Get all battlers in a battle
const getBattlersInBattle = (battleId) => {
  return new Promise((resolve, reject) => {
    socketManager.getSocket().emit('getBattlersInBattle', { battleId }, (response) => {
      if (response.error) {
        reject(response.error);
      } else {
        resolve(response.data);
      }
    });
  });
};

export default {
  getBattle,
  getBattlersInBattle,
};
