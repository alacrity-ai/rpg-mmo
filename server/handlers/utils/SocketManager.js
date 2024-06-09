class SocketManager {
    constructor() {
      if (!SocketManager.instance) {
        this.socketsByCharacterId = {};
        this.socketsByPartyId = {}; // New object to track sockets by party ID
        SocketManager.instance = this;
      }
      return SocketManager.instance;
    }
  
    registerSocket(socket, characterId, partyId = null) {
      // Unregister the socket from any previous party
      this.unregisterSocket(characterId);
  
      this.socketsByCharacterId[characterId] = socket;
      if (partyId) {
        if (!this.socketsByPartyId[partyId]) {
          this.socketsByPartyId[partyId] = [];
        }
        this.socketsByPartyId[partyId].push(socket);
        socket.partyId = partyId; // Store the party ID in the socket
      }
    }
  
    unregisterSocket(characterId) {
      const socket = this.socketsByCharacterId[characterId];
      if (socket) {
        delete this.socketsByCharacterId[characterId];
        if (socket.partyId && this.socketsByPartyId[socket.partyId]) {
          this.socketsByPartyId[socket.partyId] = this.socketsByPartyId[socket.partyId].filter(s => s !== socket);
          if (this.socketsByPartyId[socket.partyId].length === 0) {
            delete this.socketsByPartyId[socket.partyId];
          }
        }
        delete socket.partyId; // Remove the party ID from the socket
      }
    }
  
    getSocketByCharacterId(characterId) {
      return this.socketsByCharacterId[characterId];
    }
  
    getSocketsByPartyId(partyId) {
      return this.socketsByPartyId[partyId] || [];
    }
  }
  
  const instance = new SocketManager();
  Object.freeze(instance);
  
  module.exports = instance;
  