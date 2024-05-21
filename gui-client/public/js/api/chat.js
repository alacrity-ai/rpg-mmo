import socketManager from '../SocketManager';

const sendMessage = (message) => {
  return new Promise((resolve, reject) => {
    socketManager.socket.emit('sendMessage', { message }, (response) => {
      if (response.error) {
        reject(response.error);
      } else {
        resolve(response.data);
      }
    });
  });
};

const receiveMessage = (callback) => {
  socketManager.socket.on('receiveMessage', (data) => {
    callback(data);
  });
};

export default {
  sendMessage,
  receiveMessage,
};
