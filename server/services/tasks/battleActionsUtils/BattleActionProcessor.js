// services/tasks/battleActionsUtils/BattleActionProcessor.js

const { updateBattlerPosition } = require('../../../db/queries/battlerInstancesQueries');
const Redis = require('ioredis');
const redis = new Redis();

// Load cooldown values from environment variables
const COOLDOWN_MINIMUM = parseInt(process.env.COOLDOWN_MINIMUM, 10) || 500;
const COOLDOWN_SHORT = parseInt(process.env.COOLDOWN_SHORT, 10) || 1500;
const COOLDOWN_NORMAL = parseInt(process.env.COOLDOWN_NORMAL, 10) || 3000;
const COOLDOWN_LONG = parseInt(process.env.COOLDOWN_LONG, 10) || 5000;

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
    const cooldownKey = `cooldown:${action.battlerId}`;
    const currentTime = Date.now();

    // Check cooldown from Redis
    const cooldownEndTime = await redis.get(cooldownKey);

    if (cooldownEndTime && currentTime < cooldownEndTime) {
      return {
        success: false,
        message: 'Battler is currently on cooldown',
        battlerId: action.battlerId,
        actionType: action.actionType,
        actionData: action.actionData
      };
    }

    // Validate new position based on team
    const isValidPosition = (team === 'player')
        ? action.actionData.newPosition[0] >= 0 && action.actionData.newPosition[0] <= 2 && action.actionData.newPosition[1] >= 0 && action.actionData.newPosition[1] <= 2
        : action.actionData.newPosition[0] >= 3 && action.actionData.newPosition[0] <= 5 && action.actionData.newPosition[1] >= 0 && action.actionData.newPosition[1] <= 2;

    if (!isValidPosition) {
      return {
        success: false,
        message: 'Invalid move action',
        battlerId: action.battlerId,
        actionType: action.actionType,
        actionData: action.actionData
      };
    }

    await updateBattlerPosition(action.battlerId, action.actionData.newPosition);
    
    // Set cooldown in Redis
    const cooldownDuration = COOLDOWN_SHORT; // 1500 ms default
    await redis.set(cooldownKey, currentTime + cooldownDuration, 'PX', cooldownDuration);

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
