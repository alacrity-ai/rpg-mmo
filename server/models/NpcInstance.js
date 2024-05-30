// models/NpcInstance.js
/**
 * Class representing an NPC instance.
 */
class NpcInstance {
    /**
     * Create an NPC instance.
     * @param {Object} params - The parameters for creating an NPC instance.
     * @param {number} params.id - The ID of the NPC instance.
     * @param {number} params.npc_template_id - The ID of the NPC template.
     * @param {number} params.current_area_id - The ID of the current area the NPC is in.
     * @param {Object} params.baseStats - The base stats of the NPC.
     * @param {number} params.baseStats.health - The base health of the NPC.
     * @param {number} params.baseStats.mana - The base mana of the NPC.
     * @param {number} params.baseStats.strength - The base strength of the NPC.
     * @param {number} params.baseStats.stamina - The base stamina of the NPC.
     * @param {number} params.baseStats.intelligence - The base intelligence of the NPC.
     * @param {Object} params.currentStats - The current stats of the NPC.
     * @param {number} params.currentStats.health - The current health of the NPC.
     * @param {number} params.currentStats.mana - The current mana of the NPC.
     * @param {number} params.currentStats.strength - The current strength of the NPC.
     * @param {number} params.currentStats.stamina - The current stamina of the NPC.
     * @param {number} params.currentStats.intelligence - The current intelligence of the NPC.
     * @param {string} params.state - The state of the NPC.
     */
    constructor({ id, npc_template_id, current_area_id, base_stats, current_stats, state }) {
      this.id = id;
      this.npcTemplateId = npc_template_id;
      this.currentAreaId = current_area_id;
      this.baseStats = base_stats;
      this.currentStats = current_stats;
      this.state = state;
    }
  }
  
  module.exports = NpcInstance;
  
  /**
   * Example usage:
   * 
   * const npcInstance = new NpcInstance({
   *   id: 1,
   *   npc_template_id: 101,
   *   current_area_id: 201,
   *   baseStats: { health: 20, mana: 10, strength: 5, stamina: 7, intelligence: 3 },
   *   currentStats: { health: 15, mana: 10, strength: 5, stamina: 7, intelligence: 3 },
   *   state: 'idle'
   * });
   * 
   * console.log(npcInstance);
   * // NpcInstance {
   * //   id: 1,
   * //   npcTemplateId: 101,
   * //   currentAreaId: 201,
   * //   baseStats: { health: 20, mana: 10, strength: 5, stamina: 7, intelligence: 3 },
   * //   currentStats: { health: 15, mana: 10, strength: 5, stamina: 7, intelligence: 3 },
   * //   state: 'idle'
   * // }
   */
  