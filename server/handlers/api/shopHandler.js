// handlers/shopHandler.js
const { getShopTemplateById } = require('../../db/queries/shopTemplatesQueries');
const { getItemTemplateById } = require('../../db/queries/itemTemplatesQueries');

async function handleShopCommand(socket, input, io, callback) {
    const { command, shopId, itemId } = input;
    console.log(`Received ShopCommand: ${command}`);
    
    if (!socket.user) {
        callback({ error: 'You need to be logged in to use this command.' });
        return;
    }

    try {
        switch (command) {
            case 'viewShopInventory':
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

                // Send the structured items to the client
                callback({ data: structuredItems });
                break;
            
            case 'buyItem':
                // Handle buy item logic
                // Placeholder for buy item functionality
                callback({ data: 'Item bought successfully!' });
                break;

            // Add more cases for other shop-related commands, such as sellItem, etc.

            default:
                callback({ error: 'Unknown command.' });
        }
    } catch (error) {
        console.error('Error handling shop command:', error);
        callback({ error: 'An error occurred while processing the shop command.' });
    }
}

module.exports = { handleShopCommand };
