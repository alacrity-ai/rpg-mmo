const { updateBattlerPosition } = require('../../../db/queries/battlerInstanceQueries');

class BattleActionProcessor {
  /**
   * Process a single battler action.
   * @param {Object} action - The action to process.
   * @returns {Object} The result of processing the action.
   */
  static async processSingleAction(action) {
    switch (action.actionType) {
      case 'ability':
        return this.processAbilityAction(action);
      case 'move':
        return this.processMoveAction(action);
      case 'item':
        return this.processItemAction(action);
      default:
        throw new Error(`Unknown action type: ${action.actionType}`);
    }
  }

  /**
   * Process a single ability action.
   * @param {Object} action - The ability action to process.
   * @returns {Object} The result of processing the ability action.
   */
  static async processAbilityAction(action) {
    // Simulate processing ability action
    // TODO: Implement the actual business logic
    return {
      success: true,
      message: 'Ability action processed successfully',
      battlerId: action.battlerId,
      actionType: action.actionType,
      actionData: action.actionData
    };
  }

  /**
   * Process a single move action.
   * @param {Object} action - The move action to process.
   * @returns {Object} The result of processing the move action.
   */
  static async processMoveAction(action) {
    const team = action.actionData.team || 'enemy';

    // If the team is the player, check if the new position is valid
    if (team === 'player') {
        if (action.actionData.newPosition[0] < 0 || action.actionData.newPosition[0] > 2 || action.actionData.newPosition[1] < 0 || action.actionData.newPosition[1] > 2) {
            return {
                success: false,
                message: 'Invalid move action',
                battlerId: action.battlerId,
                actionType: action.actionType,
                actionData: action.actionData
            };
        }
    } else {
        if (action.actionData.newPosition[0] < 3 || action.actionData.newPosition[0] > 5 || action.actionData.newPosition[1] < 0 || action.actionData.newPosition[1] > 2) {
            return {
                success: false,
                message: 'Invalid move action',
                battlerId: action.battlerId,
                actionType: action.actionType,
                actionData: action.actionData
            };
        }
    }
    await updateBattlerPosition(action.battlerId, action.actionData.newPosition);
    return {
      success: true,
      message: 'Move action processed successfully',
      battlerId: action.battlerId,
      actionType: action.actionType,
      actionData: action.actionData
    };
  }

  /**
   * Process a single item action.
   * @param {Object} action - The item action to process.
   * @returns {Object} The result of processing the item action.
   */
  static async processItemAction(action) {
    // Simulate processing item action
    // TODO: Implement the actual business logic
    return {
      success: true,
      message: 'Item action processed successfully',
      battlerId: action.battlerId,
      actionType: action.actionType,
      actionData: action.actionData
    };
  }
}

module.exports = BattleActionProcessor;
