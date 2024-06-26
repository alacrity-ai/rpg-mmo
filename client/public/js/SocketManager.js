import io from 'socket.io-client';
import PartyInvitationMenu from './interface/menu/PartyInvitationMenu';

class SocketManager {
  constructor() {
    if (!SocketManager.instance) {
      this.socket = null;
      this.currentScene = null;
      SocketManager.instance = this;
    }
    return SocketManager.instance;
  }

  static getInstance() {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  connect(serverUrl) {
    return new Promise((resolve, reject) => {
      this.socket = io(serverUrl, {
        query: {
          token: import.meta.env.VITE_CLIENT_TOKEN
        }
      });

      this.socket.on('connect', () => {
        console.log('Connected to server');
        resolve();
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from server');
      });

      this.socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        reject(error);
      });

      // Add listeners for custom events
      this.socket.on('partyInvite', this.handlePartyInvite.bind(this));
      this.socket.on('partyUpdate', this.handlePartyUpdate.bind(this));
    });
  }

  setCurrentScene(scene) {
    this.currentScene = scene;
  }

  getSocket() {
    if (!this.socket) {
      throw new Error('Socket is not initialized. Call connect() first.');
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinBattle(battleInstanceId) {
    this.getSocket().emit('joinBattle', battleInstanceId);
    console.log('Joined battle room: ', `battle-${battleInstanceId}`);
  }

  leaveBattle(battleInstanceId) {
    this.getSocket().emit('leaveBattle', battleInstanceId);
  }

  handlePartyInvite(data) {
    console.log('Received party invite:', data);
    const inviteMessage = `You have been invited to join a party by ${data.invitedBy}.`;
    console.log(inviteMessage);

    if (this.currentScene) {
      // if an invitationMenu is already open, do not create a new one
      if (this.currentScene.partyInvitationMenu) {
        console.log('Party invitation menu already open.');
        return;
      } 
      const invitationMenu = new PartyInvitationMenu(this.currentScene, data.invitedBy, data.partyId);
      this.currentScene.partyInvitationMenu = invitationMenu;
    } else {
      console.warn('No current scene set. Unable to show party invite menu.');
    }
  }

  handlePartyUpdate(data) {
    console.log('Received party update:', data);
    const updateMessage = `${data.message}`;
    console.log(updateMessage);

    if (this.currentScene) {
      const partyDisplayMenu = this.currentScene.partyDisplayMenu;
      if (partyDisplayMenu) {
        partyDisplayMenu.loadPartyData();
      };
    } else {
      console.warn('No current scene set. Unable to update party UI.');
    }
  }
}

export default SocketManager.getInstance();
