// handlers/shopHandler.js
const { getShopTemplateById } = require('../../db/queries/shopTemplatesQueries');
const { getItemTemplateById } = require('../../db/queries/itemTemplatesQueries');

module.exports = (socket) => {
  socket.on('viewShopInventory', async (data, callback) => {
    const { shopId } = data;

    try {
      // Get the shop template from the database
      const shop = await getShopTemplateById(shopId);

      if (!shop) {
        callback({ error: 'Shop not found.' });
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

      // Then send the structuredItems to the client
      callback({ success: true, data: structuredItems });
    } catch (error) {
      callback({ error: 'Failed to retrieve shop inventory. ' + error.message });
    }
  });
};
