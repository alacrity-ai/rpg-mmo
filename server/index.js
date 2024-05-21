require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { handleCommand, defaultZone } = require('./handlers/commandHandler');
const { initTables } = require('./db/database');
const { populateTables } = require('./db/populateTables');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.get('/', (req, res) => {
  res.send('MUD Server is running');
});

io.on('connection', (socket) => {
  socket.on('command', (input) => {
    handleCommand(socket, input, io);
  });

  socket.on('disconnect', () => {
    if (socket.character) {
      defaultZone.removePlayer(socket.id);
      io.to(defaultZone.name).emit('message', `${socket.character.name} has left the zone.`);
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, async () => {
  await initTables();
  await populateTables(); // Call populateTables after initTables
  console.log(`Server is running on port ${PORT}`);
});
