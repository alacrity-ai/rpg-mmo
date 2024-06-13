/**
 * Class representing a battle instance.
 */
class BattleInstance {
    /**
     * Create a battle instance.
     * @param {Object} params - The parameters for creating a battle instance.
     * @param {number} params.id - The ID of the battle instance.
     * @param {Array<number>} params.battler_ids - The list of battler IDs in the battle.
     * @param {number} params.area_instance_id - The ID of the area instance where the battle is taking place.
     * @param {Date} params.time_created - The timestamp when the battle instance was created.
     * @param {boolean} params.cleared - Whether the battle instance has been cleared.
     */
    constructor({ id, battler_ids, area_instance_id, time_created, cleared }) {
        this.id = id;
        this.battlerIds = battler_ids;
        this.areaInstanceId = area_instance_id;
        this.timeCreated = time_created;
        this.cleared = !!cleared;
    }
}

module.exports = BattleInstance;

/**
 * Example usage:
 *
 * const battleInstance = new BattleInstance({
 *   id: 1,
 *   battler_ids: [101, 102, 103],
 *   area_instance_id: 10,
 *   time_created: new Date()
 *   cleared: false
 * });
 */
