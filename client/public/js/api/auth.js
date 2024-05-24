import socketManager from '../SocketManager';

// Create a user account
const createUser = (username, password) => {
  return new Promise((resolve, reject) => {
    socketManager.getSocket().emit('createAccount', { username, password }, (response) => {
      if (response.error) {
        reject(response.error);
      } else {
        resolve(response.data);
      }
    });
  });
};

// Login function
const login = (username, password) => {
  return new Promise((resolve, reject) => {
    socketManager.getSocket().emit('login', { username, password }, (response) => {
      if (response.error) {
        reject(response.error);
      } else {
        resolve(response.data);
      }
    });
  });
};

export default {
  createUser,
  login,
};
