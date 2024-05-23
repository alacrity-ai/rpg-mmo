import socketManager from '../SocketManager';

const createUser = (username, password) => {
  return new Promise((resolve, reject) => {
    socketManager.socket.emit('command', `create ${username} ${password}`, (response) => {
      if (response.error) {
        reject(response.error);
      } else {
        resolve(response.data);
      }
    });
  });
};

const login = (username, password) => {
  return new Promise((resolve, reject) => {
    socketManager.socket.emit('command', `login ${username} ${password}`, (response) => {
      if (response.error) {
        reject(response.error);
      } else {
        resolve(response.data);
      }
    });
  });
};

const createCharacter = (characterName, characterClass) => {
  return new Promise((resolve, reject) => {
    socketManager.socket.emit('command', `character new ${characterName} ${characterClass}`, (response) => {
      if (response.error) {
        reject(response.error);
      } else {
        resolve(response.data);
      }
    });
  });
};

const characterLogin = (characterName) => {
  return new Promise((resolve, reject) => {
    socketManager.socket.emit('command', `character login ${characterName}`, (response) => {
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
  createCharacter,
  characterLogin,
};
