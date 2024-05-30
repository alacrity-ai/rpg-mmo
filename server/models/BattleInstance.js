/**
 * Class representing a battle instance.
 */
class BattleInstance {
    /**
     * Create a battle instance.
     * @param {Object} params - The parameters for creating a battle instance.
     * @param {number} params.id - The ID of the battle instance.
     * @param {Array<number>} params.battler_ids - The list of battler IDs in the battle.
     * @param {Date} params.time_created - The timestamp when the battle instance was created.
     */
    constructor({ id, battler_ids, time_created }) {
        this.id = id;
        this.battlerIds = battler_ids;
        this.timeCreated = time_created;
    }
}

module.exports = BattleInstance;

/**
 * Example usage:
 *
 * const battleInstance = new BattleInstance({
 *   id: 1,
 *   battler_ids: [101, 102, 103],
 *   time_created: new Date()
 * });
 */
