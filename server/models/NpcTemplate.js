/**
 * Class representing an NPC template.
 */
class NpcTemplate {
    /**
     * Create an NPC template.
     * @param {Object} params - The parameters for creating an NPC template.
     * @param {number} params.id - The ID of the NPC template.
     * @param {string} params.name - The name of the NPC.
     * @param {string} params.spriteKey - The sprite key for the NPC.
     * @param {string} params.description - The description of the NPC.
     * @param {string} params.scriptPath - The path to the NPC's behavior script.
     * @param {Object} params.baseStats - The base stats of the NPC.
     * @param {Object[]} params.lootTable - The loot table of the NPC.
     * @param {number} params.lootTable[].item_id - The item ID in the loot table.
     * @param {number} params.lootTable[].chance_to_drop - The chance to drop the item.
     */
    constructor({ id, name, sprite_key, description, script_path, base_stats, loot_table }) {
      this.id = id;
      this.name = name;
      this.spriteKey = sprite_key;
      this.description = description;
      this.scriptPath = script_path;
      this.baseStats = base_stats;
      this.lootTable = loot_table;
    }
  }
  
  module.exports = NpcTemplate;
  
  /**
   * Example usage:
   * 
   * const npcTemplate = new NpcTemplate({
   *   id: 1,
   *   name: 'Rat',
   *   sprite_key: 'rat_sprite',
   *   description: 'A small, skittish rodent.',
   *   script_path: 'scripts/rat_behavior.js',
   *   baseStats: { strength: 3, agility: 5, health: 20 },
   *   lootTable: [
   *     { item_id: 1, chance_to_drop: 0.5 },  // Health Potion with 50% chance
   *     { item_id: 7, chance_to_drop: 0.1 }   // Leather Boots with 10% chance
   *   ]
   * });
   * 
   * console.log(npcTemplate);
   * // NpcTemplate {
   * //   id: 1,
   * //   name: 'Rat',
   * //   spriteKey: 'rat_sprite',
   * //   description: 'A small, skittish rodent.',
   * //   scriptPath: 'scripts/rat_behavior.js',
   * //   baseStats: { strength: 3, agility: 5, health: 20 },
   * //   lootTable: [
   * //     { item_id: 1, chance_to_drop: 0.5 },
   * //     { item_id: 7, chance_to_drop: 0.1 }
   * //   ]
   * // }
   */
  