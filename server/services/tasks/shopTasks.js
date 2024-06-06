const { redisClient } = require('../../redisClient');
const { getShopTemplateById } = require('../../db/queries/shopTemplatesQueries');
const { getItemTemplateById } = require('../../db/queries/itemTemplatesQueries');
const taskRegistry = require('../../handlers/taskRegistry');
const logger = require('../../utilities/logger');


async function processViewShopInventoryTask(task) {
  const { taskId, data } = task.taskData;
  const { shopId } = data;

  try {
    // Get the shop template from the database
    const shop = await getShopTemplateById(shopId);

    if (!shop) {
      const result = { error: 'Shop not found.' };
      logger.info(`Shop not found for task ${taskId}`);
      await redisClient.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
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
    await redisClient.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
  } catch (error) {
    const result = { error: 'Failed to view shop inventory. ' + error.message };
    logger.info(`View shop inventory failed for task ${taskId}:`, error.message);
    await redisClient.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
  }
}

// Register task handler
taskRegistry.register('viewShopInventory', processViewShopInventoryTask);

module.exports = {
  processViewShopInventoryTask,
};
