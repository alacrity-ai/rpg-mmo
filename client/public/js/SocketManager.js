import { io } from 'socket.io-client';

class SocketManager {
  constructor() {
    this.socket = null;
  }

  connect(url) {
    return new Promise((resolve, reject) => {
      this.socket = io(url);

      this.socket.on('connect', () => {
        console.log('Connected to MUD server!');
        resolve();
      });

      this.socket.on('connect_error', (err) => {
        console.error('Connection error:', err);
        reject(err);
      });

      this.socket.on('message', (msg) => {
        console.log('Message from server:', msg);
      });

      this.socket.on('response', (response) => {
        if (response.error) {
          console.error(response.error);
        } else {
          console.log(response.data);
        }
      });

      this.socket.on('serverTick', (msg) => {
        console.log('Server tick:', msg);
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from MUD server');
      });
    });
  }

  sendCommand(command) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('command', command);
    } else {
      console.error('Socket is not connected');
    }
  }
}

const socketManager = new SocketManager();
export default socketManager;
