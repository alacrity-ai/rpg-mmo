import socketManager from '../SocketManager';

// Create a user account
const getServerSettings = () => {
  return new Promise((resolve, reject) => {
    socketManager.getSocket().emit('getServerSettings', {}, (response) => {
      console.log('Requesting server settings')
      if (response.error) {
        console.log('Error getting server settings')
        reject(response.error);
      } else {
        console.log('Got server settings')
        resolve(response.data);
      }
    });
  });
};

export default {
    getServerSettings,
};  