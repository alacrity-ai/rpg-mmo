require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { initTables } = require('./db/database');
const { populateTables } = require('./db/populateTables');
const authHandler = require('./handlers/api/authHandler');
const characterHandler = require('./handlers/api/characterHandler');
const shopHandler = require('./handlers/api/shopHandler');
const battleHandler = require('./handlers/api/battleHandler');
const battlerHandler = require('./handlers/api/battlerHandler');
const battlerActionHandler = require('./handlers/api/battlerActionHandler');
const logger = require('./utilities/logger');

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
  logger.info(`A user connected`);

  // Use imported event handlers
  authHandler(socket, io);
  characterHandler(socket, io);
  shopHandler(socket, io);
  battleHandler(socket, io);
  battlerHandler(socket, io);
  battlerActionHandler(socket, io);

  // Handle joining a battle room
  socket.on('joinBattle', (battleInstanceId) => {
    socket.join(`battle-${battleInstanceId}`);
    logger.info(`User joined battle ${battleInstanceId}`);
  });

  // Handle leaving a battle room
  socket.on('leaveBattle', (battleInstanceId) => {
    socket.leave(`battle-${battleInstanceId}`);
    logger.info(`User left battle ${battleInstanceId}`);
  });

  socket.on('disconnect', () => {
    logger.info('A user disconnected');
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, async () => {
  await initTables();
  await populateTables(); // Call populateTables after initTables
  logger.info(`Server is running on port ${PORT}`);
});
