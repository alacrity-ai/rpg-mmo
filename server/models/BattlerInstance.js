/**
 * Class representing a battler instance.
 */
class BattlerInstance {
    /**
     * Create a battler instance.
     * @param {Object} params - The parameters for creating a battler instance.
     * @param {number} params.id - The ID of the battler instance.
     * @param {number} [params.character_id] - The ID of the character, if applicable.
     * @param {number} [params.npc_template_id] - The ID of the NPC template, if applicable.
     * @param {Object} params.base_stats - The base stats of the battler.
     * @param {Object} params.current_stats - The current stats of the battler.
     * @param {Array<number>} [params.abilities] - The list of ability IDs for the battler.
     * @param {string} [params.script_path] - The path to the battle script, if applicable.
     * @param {string} params.sprite_path - The path to the battler's sprite.
     * @param {string} params.grid_position - The grid position of the battler.
     * @param {Date} params.last_action_time - The timestamp of the last action.
     * @param {Date} params.time_created - The timestamp when the battler instance was created.
     * @param {Array<number>} [params.status_effects] - The status effects applied to the battler.
     * @param {string} params.team - The team the battler belongs to ('player' or 'enemy').
     */
    constructor({
        id,
        character_id,
        npc_template_id,
        base_stats,
        current_stats,
        abilities,
        script_path,
        sprite_path,
        grid_position,
        last_action_time,
        time_created,
        status_effects,
        team
    }) {
        this.id = id;
        this.characterId = character_id;
        this.npcTemplateId = npc_template_id;
        this.baseStats = base_stats;
        this.currentStats = current_stats;
        this.abilities = abilities;
        this.scriptPath = script_path;
        this.spritePath = sprite_path;
        this.gridPosition = grid_position;
        this.lastActionTime = last_action_time;
        this.timeCreated = time_created;
        this.statusEffects = status_effects;
        this.team = team;
    }
}

module.exports = BattlerInstance;

/**
 * Example usage:
 *
 * const battlerInstance = new BattlerInstance({
 *   id: 1,
 *   character_id: 101,
 *   npc_template_id: null,
 *   base_stats: { health: 100, mana: 50, strength: 20, stamina: 15, intelligence: 10 },
 *   current_stats: { health: 80, mana: 50, strength: 20, stamina: 15, intelligence: 10 },
 *   abilities: [1, 2, 3, 4],
 *   script_path: null,
 *   sprite_path: 'assets/battle/battlers/sprite_1.png',
 *   grid_position: 'B2',
 *   last_action_time: new Date(),
 *   time_created: new Date(),
 *   status_effects: [1, 2],
 *   team: 'player'
 * });
 */
