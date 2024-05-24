const logger = require('../../utilities/logger');

const handleMessage = (io, socket, message, zone) => {
  const character = zone.players.find(p => p.socketId === socket.id);
  const username = character ? character.name : 'undefined';
  const userId = character ? character.userId : 'undefined';
  logger.info('User ID:', userId, 'Character:', username, 'Message:', message);
  io.to(zone.name).emit('message', `${message}`);
};

module.exports = { handleMessage };
