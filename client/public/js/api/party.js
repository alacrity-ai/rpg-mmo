import socketManager from '../SocketManager';

const createParty = () => {
  return new Promise((resolve, reject) => {
    socketManager.socket.emit('createParty', {}, (response) => {
      if (response.error) {
        reject(response.error);
      } else {
        resolve(response.data);
      }
    });
  });
};

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

const inviteToParty = (invitedCharacterName) => {
  return new Promise((resolve, reject) => {
    socketManager.socket.emit('inviteToParty', { invitedCharacterName }, (response) => {
      if (response.error) {
        reject(response.error);
      } else {
        resolve(response.data);
      }
    });
  });
};

const respondToPartyInvite = (partyId, accept) => {
  return new Promise((resolve, reject) => {
    socketManager.socket.emit('respondToPartyInvite', { partyId, accept }, (response) => {
      if (response.error) {
        reject(response.error);
      } else {
        resolve(response.data);
      }
    });
  });
}

export default {
  createParty,
  getParty,
  inviteToParty,
  respondToPartyInvite
};
