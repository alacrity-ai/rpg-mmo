require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const Redis = require('ioredis');
const { initTables } = require('./db/database');
const { populateTables } = require('./db/populateTables');
const { serverTick } = require('./services/server/tick');
const authHandler = require('./handlers/api/authHandler');
const characterHandler = require('./handlers/api/characterHandler');
const shopHandler  = require('./handlers/api/shopHandler');

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
  console.log('A user connected');

  // Use imported event handlers
  authHandler(socket);
  characterHandler(socket);
  shopHandler(socket);

  socket.on('disconnect', () => {
    console.log('A user disconnected');
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

  // Start the server tick loop
  // serverTick();
});
