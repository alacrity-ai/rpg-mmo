/**
 * Class representing a battler action.
 */
class BattlerAction {
    /**
     * Create a battler action.
     * @param {Object} params - The parameters for creating a battler action.
     * @param {number} params.id - The ID of the battler action.
     * @param {number} params.battle_instance_id - The ID of the battle instance.
     * @param {number} params.battler_id - The ID of the battler.
     * @param {string} params.action_type - The type of action ('ability', 'item', 'move').
     * @param {Object} params.action_data - The data related to the action.
     * @param {Object} [params.action_result] - The result of the action.
     * @param {Date} params.battler_last_action_time - The timestamp of the battler's last action.
     * @param {Date} params.time_created - The timestamp when the battler action was created.
     * @param {Date} [params.time_completed] - The timestamp when the battler action was completed.
     */
    constructor({ id, battle_instance_id, battler_id, action_type, action_data, action_result, battler_last_action_time, time_created, time_completed }) {
        this.id = id;
        this.battleInstanceId = battle_instance_id;
        this.battlerId = battler_id;
        this.actionType = action_type;
        this.actionData = action_data;
        this.actionResult = action_result;
        this.battlerLastActionTime = battler_last_action_time;
        this.timeCreated = time_created;
        this.timeCompleted = time_completed;
    }
}

module.exports = BattlerAction;

/**
 * Example usage:
 *
 * const battleAction = new BattlerAction({
 *   id: 1,
 *   battle_instance_id: 1,
 *   battler_id: 1,
 *   action_type: 'ability',
 *   action_data: { abilityId: 1, targetId: 2 },
 *   action_result: { success: true },
 *   battler_last_action_time: new Date(),
 *   time_created: new Date(),
 *   time_completed: new Date()
 * });
 */
