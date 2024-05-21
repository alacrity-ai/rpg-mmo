import socketManager from '../SocketManager';

const getStats = () => {
  return new Promise((resolve, reject) => {
    socketManager.socket.emit('getStats', {}, (response) => {
      if (response.error) {
        reject(response.error);
      } else {
        resolve(response.data);
      }
    });
  });
};

export default {
  getStats,
};
