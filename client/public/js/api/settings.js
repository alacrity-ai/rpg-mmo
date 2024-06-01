import socketManager from '../SocketManager';

// Create a user account
const getServerSettings = () => {
  return new Promise((resolve, reject) => {
    socketManager.getSocket().emit('getServerSettings', {}, (response) => {
      if (response.error) {
        reject(response.error);
      } else {
        resolve(response.data);
      }
    });
  });
};

export default {
    getServerSettings,
};  