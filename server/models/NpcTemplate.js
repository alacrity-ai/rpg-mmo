/**
 * Class representing an NPC template.
 */
class NpcTemplate {
  /**
   * Create an NPC template.
   * @param {Object} params - The parameters for creating an NPC template.
   * @param {number} params.id - The ID of the NPC template.
   * @param {string} params.name - The name of the NPC.
   * @param {string} params.sprite_key - The sprite key for the NPC.
   * @param {string} params.description - The description of the NPC.
   * @param {string} params.script_path - The script path for the NPC behavior.
   * @param {number} params.script_speed - The speed at which the NPC script runs.
   * @param {Object} params.baseStats - The base stats of the NPC.
   * @param {number} params.baseStats.health - The base health of the NPC.
   * @param {number} params.baseStats.mana - The base mana of the NPC.
   * @param {number} params.baseStats.strength - The base strength of the NPC.
   * @param {number} params.baseStats.stamina - The base stamina of the NPC.
   * @param {number} params.baseStats.intelligence - The base intelligence of the NPC.
   * @param {Object} params.loot_table - The loot table for the NPC.
   * @param {number} [params.npc_dialogue_template_id] - The ID of the dialogue template associated with the NPC (nullable).
   * @param {string} params.battler_sprite_path - The path to the battler sprite for the NPC.
   */
  constructor({ id, name, sprite_key, description, script_path, script_speed, base_stats, loot_table, npc_dialogue_template_id = null, battler_sprite_path }) {
    this.id = id;
    this.name = name;
    this.spriteKey = sprite_key;
    this.description = description;
    this.scriptPath = script_path;
    this.scriptSpeed = script_speed;
    this.baseStats = base_stats;
    this.lootTable = loot_table;
    this.npcDialogueTemplateId = npc_dialogue_template_id;
    this.battlerSpritePath = battler_sprite_path;
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
 *   script_speed: 2500,
 *   baseStats: { health: 20, mana: 0, strength: 3, stamina: 5, intelligence: 1 },
 *   lootTable: [
 *     { item_id: 1, chance_to_drop: 0.5 },
 *     { item_id: 7, chance_to_drop: 0.1 }
 *   ],
 *   npc_dialogue_template_id: null,
 *   battler_sprite_path: 'assets/sprites/rat_battler.png'
 * });
 */
