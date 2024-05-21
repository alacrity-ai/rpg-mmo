import socketManager from '../SocketManager';

const getNpcDetails = (npcId) => {
  return new Promise((resolve, reject) => {
    socketManager.socket.emit('getNpcDetails', { npcId }, (response) => {
      if (response.error) {
        reject(response.error);
      } else {
        resolve(response.data);
      }
    });
  });
};

const talkToNpc = (npcId, dialogueOption) => {
  return new Promise((resolve, reject) => {
    socketManager.socket.emit('talkToNpc', { npcId, dialogueOption }, (response) => {
      if (response.error) {
        reject(response.error);
      } else {
        resolve(response.data);
      }
    });
  });
};

export default {
  getNpcDetails,
  talkToNpc,
};
