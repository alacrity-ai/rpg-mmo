const { updateBattlerPosition, updateBattlerHealth, applyStatusEffect } = require('../../../db/queries/battlerInstancesQueries');
const Redis = require('ioredis');
const redis = new Redis();

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
        const { actionData } = action;
        let results = [];

        if (actionData.damage) {
            results.push(await this.doDamage(actionData.targetId, actionData.damage));
        }

        if (actionData.healing) {
            results.push(await this.doHealing(actionData.targetId, actionData.healing));
        }

        if (actionData.statusEffects) {
            for (let status of actionData.statusEffects) {
                results.push(await this.applyStatus(actionData.targetId, status));
            }
        }

        return {
            success: true,
            message: 'Ability action processed successfully',
            battlerId: action.battlerId,
            actionType: action.actionType,
            actionData: action.actionData,
            results
        };
    }

    /**
     * Apply damage to a battler.
     * @param {number} targetId - The ID of the target battler.
     * @param {number} damage - The amount of damage to apply.
     * @returns {Object} The result of applying the damage.
     */
    static async doDamage(targetId, damage) {
        let target = await this.getBattlerById(targetId); // Assume this function fetches the battler from the database
        target.health -= damage;
        await updateBattlerHealth(target.id, target.health);

        return {
            success: true,
            message: `Applied ${damage} damage to battler ${targetId}`
        };
    }

    /**
     * Apply healing to a battler.
     * @param {number} targetId - The ID of the target battler.
     * @param {number} healing - The amount of healing to apply.
     * @returns {Object} The result of applying the healing.
     */
    static async doHealing(targetId, healing) {
        let target = await this.getBattlerById(targetId); // Assume this function fetches the battler from the database
        target.health += healing;
        await updateBattlerHealth(target.id, target.health);

        return {
            success: true,
            message: `Applied ${healing} healing to battler ${targetId}`
        };
    }

    /**
     * Apply a status effect to a battler.
     * @param {number} targetId - The ID of the target battler.
     * @param {string} status - The status effect to apply.
     * @returns {Object} The result of applying the status effect.
     */
    static async applyStatus(targetId, status) {
        await applyStatusEffect(targetId, status); // Assume this function applies the status effect to the battler in the database

        return {
            success: true,
            message: `Applied status ${status} to battler ${targetId}`
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

    // Placeholder function for fetching a battler by ID
    static async getBattlerById(id) {
        // Implement the logic to fetch a battler by ID from the database
    }
}

module.exports = BattleActionProcessor;
