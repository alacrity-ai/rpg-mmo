import socketManager from '../SocketManager';

const login = (username, password) => {
  return new Promise((resolve, reject) => {
    socketManager.socket.emit('login', { username, password }, (response) => {
      if (response.error) {
        reject(response.error);
      } else {
        resolve(response.data);
      }
    });
  });
};

const logout = () => {
  return new Promise((resolve, reject) => {
    socketManager.socket.emit('logout', {}, (response) => {
      if (response.error) {
        reject(response.error);
      } else {
        resolve(response.data);
      }
    });
  });
};

const register = (username, password) => {
  return new Promise((resolve, reject) => {
    socketManager.socket.emit('register', { username, password }, (response) => {
      if (response.error) {
        reject(response.error);
      } else {
        resolve(response.data);
      }
    });
  });
};

export default {
  login,
  logout,
  register,
};
