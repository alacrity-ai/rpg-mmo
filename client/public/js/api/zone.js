import socketManager from '../SocketManager';

const getCurrentZone = () => {
  return new Promise((resolve, reject) => {
    socketManager.socket.emit('getCurrentZone', {}, (response) => {
      if (response.error) {
        reject(response.error);
      } else {
        resolve(response.data);
      }
    });
  });
};

const requestZone = (sceneKey) => {
  return new Promise((resolve, reject) => {
    socketManager.getSocket().emit('requestZone', { sceneKey }, (response) => {
      if (response.error) {
        reject(response.error);
      } else {
        resolve(response.data);
      }
    });
  });
};

export default {
  requestZone,
  getCurrentZone,
};
