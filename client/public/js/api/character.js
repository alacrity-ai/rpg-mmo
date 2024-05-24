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
const characterLogin = (characterName) => {
  return new Promise((resolve, reject) => {
    socketManager.getSocket().emit('characterLogin', { characterName }, (response) => {
      if (response.error) {
        reject(response.error);
      } else {
        resolve(response.data);
      }
    });
  });
};

export default {
  createCharacter,
  characterLogin,
};