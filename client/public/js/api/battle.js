import socketManager from '../SocketManager';

const getBattleInstance = (areaId) => {
  return new Promise((resolve, reject) => {
    socketManager.getSocket().emit('getBattleInstance', { areaId }, (response) => {
      if (response.error) {
        reject(response.error);
      } else {
        resolve(response.data);
      }
    });
  });
};

export default {
  getBattleInstance
};
