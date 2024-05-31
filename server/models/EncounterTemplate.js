// models/EncounterTemplate.js

/**
 * Class representing an encounter template.
 */
class EncounterTemplate {
  /**
   * Create an encounter template.
   * @param {Object} params - The parameters for creating an encounter template.
   * @param {number} params.id - The ID of the encounter template.
   * @param {string} params.name - The name of the encounter.
   * @param {Array<Object>} params.enemies - The enemies in the encounter.
   * @param {boolean} params.is_boss - Whether the encounter is a boss fight.
   * @param {number} params.enemies[].npc_template_id - The ID of the NPC template.
   * @param {Array<number>} params.enemies[].position - The position of the NPC in the battle arena [X, Y].
   */
  constructor({ id, name, enemies, is_boss }) {
    this.id = id;
    this.name = name;
    this.enemies = enemies;
    this.isBoss = is_boss;
  }
}

module.exports = EncounterTemplate;

/**
* Example usage:
*
* const encounterTemplate = new EncounterTemplate({
*   id: 1,
*   name: 'Goblin Ambush',
*   enemies: [
*     { npc_template_id: 1, position: [3, 0] },
*     { npc_template_id: 1, position: [3, 1] },
*     { npc_template_id: 2, position: [4, 2] }
*   ],
*   isBoss: false
* });
*
* console.log(encounterTemplate);
* // EncounterTemplate {
* //   id: 1,
* //   name: 'Goblin Ambush',
* //   enemies: [
* //     { npc_template_id: 1, position: [3, 0] },
* //     { npc_template_id: 1, position: [3, 1] },
* //     { npc_template_id: 2, position: [4, 2] }
* //   ],
* //   isBoss: false
* // }
*/
