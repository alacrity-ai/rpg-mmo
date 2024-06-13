const config = require('./config/config');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const Initializer = require('./services/Initializer');
const authHandler = require('./handlers/authHandler');
const characterHandler = require('./handlers/characterHandler');
const shopHandler = require('./handlers/shopHandler');
const battleHandler = require('./handlers/battleHandler');
const battlerHandler = require('./handlers/battlerHandler');
const battlerActionHandler = require('./handlers/battlerActionHandler');
const settingsHandler = require('./handlers/settingsHandler');
const partyHandler = require('./handlers/partyHandler');
const zoneHandler = require('./handlers/zoneHandler');
const logger = require('./utilities/logger');
const redisClient = require('./db/cache/client/RedisClient').getRedisClient();
const redisPub = require('./db/cache/client/RedisClient').getRedisClient();

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
  res.send('Server is running');
});

io.on('connection', (socket) => {
  logger.info(`A user connected`);

  // Use imported event handlers
  authHandler(socket, io, redisPub);
  characterHandler(socket, io, redisPub);
  shopHandler(socket, io, redisPub);
  battleHandler(socket, io, redisPub);
  battlerHandler(socket, io, redisPub);
  battlerActionHandler(socket, io, redisPub);
  settingsHandler(socket, io, redisPub);
  partyHandler(socket, io, redisPub);
  zoneHandler(socket, io, redisPub);
});

const PORT = config.server.port;

(async () => {
  try {
    await Initializer.initDatabase(redisClient);
    Initializer.startServices(io, redisClient, redisPub);
    server.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Error during initialization', error);
    process.exit(1); // Exit process with failure
  }
})();
