import socketManager from '../SocketManager';

const getParty = () => {
  return new Promise((resolve, reject) => {
    socketManager.socket.emit('getParty', {}, (response) => {
      if (response.error) {
        reject(response.error);
      } else {
        resolve(response.data);
      }
    });
  });
};

const inviteToParty = (playerId) => {
  return new Promise((resolve, reject) => {
    socketManager.socket.emit('inviteToParty', { playerId }, (response) => {
      if (response.error) {
        reject(response.error);
      } else {
        resolve(response.data);
      }
    });
  });
};

export default {
  getParty,
  inviteToParty,
};
