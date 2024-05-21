/**
 * Class representing an item template.
 */
class ItemTemplate {
    /**
     * Create an item template.
     * @param {Object} params - The parameters for creating an item template.
     * @param {number} params.id - The ID of the item template.
     * @param {string} params.name - The name of the item.
     * @param {string} params.description - The description of the item.
     * @param {string} params.itemType - The type of the item.
     * @param {boolean} params.isEquipment - Whether the item is equipment.
     * @param {string} [params.equipmentType] - The type of equipment.
     * @param {string} params.iconKey - The key for the item's icon.
     * @param {Array<number>} params.classes - An array of class template IDs that can use the item.
     * @param {Object} params.stats - The stats of the item.
     * @param {boolean} params.isCollectible - Whether the item is collectible.
     * @param {Object} params.useEffect - The use effect of the item.
     */
    constructor({ id, name, description, item_type, is_equipment, equipment_type, icon_key, classes, stats, is_collectible, use_effect }) {
      this.id = id;
      this.name = name;
      this.description = description;
      this.itemType = item_type;
      this.isEquipment = is_equipment;
      this.equipmentType = equipment_type;
      this.iconKey = icon_key;
      this.classes = classes;
      this.stats = stats;
      this.isCollectible = is_collectible;
      this.useEffect = use_effect;
    }
  }
  
  module.exports = ItemTemplate;
  
  /**
   * Example usage:
   * 
   * const itemTemplate = new ItemTemplate({
   *   id: 1,
   *   name: 'Health Potion',
   *   description: 'A potion that restores health.',
   *   itemType: 'consumable',
   *   isEquipment: false,
   *   equipmentType: null,
   *   iconKey: 'potion-red',
   *   classes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
   *   stats: {
   *     health_restore: 50
   *   },
   *   isCollectible: true,
   *   useEffect: {
   *     effect_type: 'restore_health',
   *     amount: 50
   *   }
   * });
   * 
   * console.log(itemTemplate);
   * // ItemTemplate {
   * //   id: 1,
   * //   name: 'Health Potion',
   * //   description: 'A potion that restores health.',
   * //   itemType: 'consumable',
   * //   isEquipment: false,
   * //   equipmentType: null,
   * //   iconKey: 'potion-red',
   * //   classes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
   * //   stats: { health_restore: 50 },
   * //   isCollectible: true,
   * //   useEffect: { effect_type: 'restore_health', amount: 50 }
   * // }
   */
  