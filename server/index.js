require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const Redis = require('ioredis');
const { handleCommand, defaultZone } = require('./handlers/commandHandler');
const { handleShopCommand } = require('./handlers/api/shopHandler');
const { initTables } = require('./db/database');
const { populateTables } = require('./db/populateTables');
const { serverTick } = require('./services/server/tick');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true
  }
});

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));

app.get('/', (req, res) => {
  res.send('MUD Server is running');
});

io.on('connection', (socket) => {
  socket.on('command', (input) => {
    handleCommand(socket, input, io);
  });

  socket.on('shopCommand', (input, callback) => {
    console.log('Received shop command:', input);
    handleShopCommand(socket, input, io, callback);
  });

  socket.on('disconnect', () => {
    if (socket.character) {
      defaultZone.removePlayer(socket.id);
      io.to(defaultZone.name).emit('message', `${socket.character.name} has left the zone.`);
    }
  });
});

const PORT = process.env.PORT || 3000;

const redis = new Redis();
redis.subscribe('serverTickChannel', (err, count) => {
  if (err) {
    console.error('Failed to subscribe: %s', err.message);
  } else {
    console.log(`Subscribed successfully! This client is currently subscribed to ${count} channels.`);
  }
});

redis.on('message', (channel, message) => {
  if (channel === 'serverTickChannel') {
    console.log('Broadcasting serverTick to clients:', message);
    io.emit('serverTick', message);
  }
});

server.listen(PORT, async () => {
  await initTables();
  await populateTables(); // Call populateTables after initTables
  console.log(`Server is running on port ${PORT}`);

  // // Start the server tick loop
  // serverTick();
});
