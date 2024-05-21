/**
 * Class representing a shop template.
 */
class ShopTemplate {
    /**
     * Create a shop template.
     * @param {Object} params - The parameters for creating a shop template.
     * @param {number} params.id - The ID of the shop template.
     * @param {string} params.name - The name of the shop.
     * @param {Object} params.inventory - The inventory of the shop.
     * @param {Array<Object>} params.inventory.items - The items in the shop's inventory.
     * @param {number} params.inventory.items[].item_id - The ID of the item.
     * @param {number} params.inventory.items[].price - The price of the item.
     */
    constructor({ id, name, inventory }) {
      this.id = id;
      this.name = name;
      this.inventory = inventory;
    }
  }
  
module.exports = ShopTemplate;

/**
 * Example usage:
 * 
 * const shopTemplate = new ShopTemplate({
 *   id: 1,
 *   name: 'General Store',
 *   inventory: {
 *     items: [
 *       { item_id: 1, price: 10 },  // Health Potion
 *       { item_id: 2, price: 15 },  // Mana Potion
 *       { item_id: 7, price: 25 },  // Leather Boots
 *       { item_id: 8, price: 50 },  // Ring of Strength
 *       { item_id: 9, price: 75 },  // Amulet of Wisdom
 *       { item_id: 12, price: 100 } // Golden Ring
 *     ]
 *   }
 * });
 * 
 * console.log(shopTemplate);
 * // ShopTemplate {
 * //   id: 1,
 * //   name: 'General Store',
 * //   inventory: {
 * //     items: [
 * //       { item_id: 1, price: 10 },
 * //       { item_id: 2, price: 15 },
 * //       { item_id: 7, price: 25 },
 * //       { item_id: 8, price: 50 },
 * //       { item_id: 9, price: 75 },
 * //       { item_id: 12, price: 100 }
 * //     ]
 * //   }
 * // }
 */
