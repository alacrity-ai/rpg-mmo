/**
 * Class representing a character's inventory.
 */
class CharacterInventory {
    /**
     * Create a character's inventory.
     * @param {Object} params - The parameters for creating a character's inventory.
     * @param {number} params.id - The ID of the character inventory.
     * @param {number} params.character_id - The ID of the character.
     * @param {Array<number>} params.inventory_slots - Array of item template IDs.
     * @param {number} params.gold - The amount of gold the character has.
     */
    constructor({ id, character_id, inventory_slots, gold }) {
      this.id = id;
      this.characterId = character_id;
      this.inventorySlots = inventory_slots;
      this.gold = gold;
    }
  }
  
  module.exports = CharacterInventory;
  
  /**
   * Example usage:
   * 
   * const characterInventory = new CharacterInventory({
   *   id: 1,
   *   character_id: 1,
   *   inventory_slots: [101, 0, 0, 0, 0, 0, 0, 0, 0, 0],
   *   gold: 100
   * });
   * 
   * console.log(characterInventory);
   * // CharacterInventory {
   * //   id: 1,
   * //   characterId: 1,
   * //   inventorySlots: [101, 0, 0, 0, 0, 0, 0, 0, 0, 0],
   * //   gold: 100
   * // }
   */
  