# Task Management Guide 

This document provides guidelines on how to create and manage tasks in the system. Follow these steps to ensure tasks are properly created, registered, and handled. 

## Steps to Create a New Task 

1. **Create a New Task** 
	- If the task fits an existing category, add the new task function to the corresponding file in `services/tasks/<category>Tasks.js`. 
	- If the category does not exist, create a new file `services/tasks/<newCategory>Tasks.js` and define the task function within this file. 

Example: Adding a `viewShopInventory` task to `shopTasks.js`. 

```
const Redis = require('ioredis');
const { getShopTemplateById } = require('../../db/queries/shopTemplatesQueries');
const { getItemTemplateById } = require('../../db/queries/itemTemplatesQueries');
const taskRegistry = require('../server/taskRegistry');

const redis = new Redis();

async function processViewShopInventoryTask(task) {
  const { taskId, data } = task.taskData;
  const { shopId } = data;

  try {
    // Get the shop template from the database
    const shop = await getShopTemplateById(shopId);

    if (!shop) {
      const result = { error: 'Shop not found.' };
      logger.info(`Shop not found for task ${taskId}`);
      await redis.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
      return;
    }

    // For each item in the shop's inventory, get the item from the database
    const items = await Promise.all(shop.inventory.items.map(async (item) => {
      const itemTemplate = await getItemTemplateById(item.item_id);
      return {
        ...item,
        item: itemTemplate
      };
    }));

    // Organize the items into a structure that is usable by the client
    const structuredItems = items.map((item) => {
      return {
        name: item.item.name,
        price: item.price,
        description: item.item.description,
        icon: item.item.iconKey
      };
    });

    const result = { success: true, data: structuredItems };
    logger.info(`View shop inventory successful for task ${taskId}`);
    await redis.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
  } catch (error) {
    const result = { error: 'Failed to view shop inventory. ' + error.message };
    logger.info(`View shop inventory failed for task ${taskId}:`, error.message);
    await redis.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
  }
}

// Register task handler
taskRegistry.register('viewShopInventory', processViewShopInventoryTask);

module.exports = {
  processViewShopInventoryTask,
};

```

**Add Import Line in `worker.js`**

- Add a `require` line in `worker.js` to import your task category if you created a new one.

Example:
```
require('dotenv').config();
const Redis = require('ioredis');
const { getTask } = require('./services/server/taskQueue');
const taskRegistry = require('./services/server/taskRegistry');

// Import task modules to ensure they are registered
require('./services/tasks/userTasks');
require('./services/tasks/shopTasks'); // Add new task category here

const redis = new Redis();

async function processTasks() {
  while (true) {
    const task = await getTask();
    if (task) {
      logger.info('Processing task:', task);
      const { taskType } = task;
      const taskHandler = taskRegistry.getHandler(taskType);

      if (taskHandler) {
        try {
          await taskHandler(task);
        } catch (error) {
          logger.error(`Failed to process task ${taskType}:`, error);
          const result = { error: `Failed to process task ${taskType}. ` + error.message };
          await redis.publish(`task-result:${task.taskData.taskId}`, JSON.stringify({ taskId: task.taskData.taskId, result }));
        }
      } else {
        logger.error(`No handler found for task type: ${taskType}`);
        const result = { error: `No handler found for task type: ${taskType}` };
        await redis.publish(`task-result:${task.taskData.taskId}`, JSON.stringify({ taskId: task.taskData.taskId, result }));
      }
    } else {
      logger.info('No tasks in queue, waiting...');
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait a bit before checking again
    }
  }
}

processTasks().catch(logger.error);

```

**Create a Server Handler**

- Create a handler to enqueue the new task when received from the client. Place this in `handlers/api/<category>Handler.js`.

Example: Creating `shopHandler.js` for `viewShopInventory` task.

```
const { enqueueTask } = require('../../services/server/taskUtils');

module.exports = (socket) => {
  socket.on('viewShopInventory', async (data, callback) => {
    enqueueTask('viewShopInventory', data, callback);
  });
};

```

**Attach the Handler to the Socket in `index.js`**

- Ensure the new handler is attached to the socket upon connection in `index.js`.

Example:

```
require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { initTables } = require('./db/database');
const { populateTables } = require('./db/populateTables');
const authHandler = require('./handlers/api/authHandler');
const characterHandler = require('./handlers/api/characterHandler');
const shopHandler = require('./handlers/api/shopHandler'); // Add new handler import

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
  logger.info('A user connected');

  // Use imported event handlers
  logger.info('Attaching authHandler');
  authHandler(socket);
  logger.info('Attaching characterHandler');
  characterHandler(socket);
  logger.info('Attaching shopHandler'); // Attach new handler
  shopHandler(socket);

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

```


Example Corresponding Client Side API for viewShopInventory.

This is kept in the client repo, in api/shop.js:

```
// api/shop.js
import socketManager from '../SocketManager';

const viewShopInventory = (shopId) => {
  return new Promise((resolve, reject) => {
    socketManager.getSocket().emit('viewShopInventory', { shopId }, (response) => {
      if (response.error) {
        reject(response.error);
      } else {
        resolve(response.data);
      }
    });
  });
};

export default {
  viewShopInventory,
};
```

The client can then call this from a scene like:

```
api.shop.viewShopInventory(shopId).then(items => {
                // Create and show the shop menu with the fetched items
                logger.info('Fetching shop inventory');
                this.shopMenu = new ShopMenu(this, items);
                this.shopMenu.show();

```