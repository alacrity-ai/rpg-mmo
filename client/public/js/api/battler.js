import socketManager from '../SocketManager';

// Get abilities for the current battler
const getBattlerAbilities = () => {
  return new Promise((resolve, reject) => {
    socketManager.getSocket().emit('getBattlerAbilities', {}, (response) => {
      if (response.error) {
        reject(response.error);
      } else {
        resolve(response.data);
      }
    });
  });
};

export default {
    getBattlerAbilities,
};  