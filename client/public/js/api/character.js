import socketManager from '../SocketManager';

// Create a new character
const createCharacter = (characterName, characterClass) => {
  return new Promise((resolve, reject) => {
    socketManager.getSocket().emit('createCharacter', { characterName, characterClass }, (response) => {
      if (response.error) {
        reject(response.error);
      } else {
        resolve(response.data);
      }
    });
  });
};

// Character login
const loginCharacter = (characterName) => {
  return new Promise((resolve, reject) => {
    socketManager.getSocket().emit('loginCharacter', { characterName }, (response) => {
      if (response.error) {
        reject(response.error);
      } else {
        resolve(response.data);
      }
    });
  });
};

// Character list
const characterList = () => {
  return new Promise((resolve, reject) => {
    socketManager.getSocket().emit('characterList', {}, (response) => {
      if (response.error) {
        reject(response.error);
      } else {
        resolve(response.data);
      }
    });
  });
};

export default {
  characterList,
  createCharacter,
  loginCharacter,
};