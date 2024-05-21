import socketManager from '../SocketManager';

const performAttack = (targetId) => {
  return new Promise((resolve, reject) => {
    socketManager.socket.emit('performAttack', { targetId }, (response) => {
      if (response.error) {
        reject(response.error);
      } else {
        resolve(response.data);
      }
    });
  });
};

export default {
  performAttack,
};
