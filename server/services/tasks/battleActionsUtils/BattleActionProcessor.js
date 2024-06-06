const { updateBattlerPosition, updateBattlerHealth, updateBattlerMana, applyStatusEffect, getBattlerInstanceById } = require('../../../db/queries/battlerInstancesQueries');
const { getCooldownDuration } = require('../../../utilities/helpers');
const { redisClient } = require('../../../redisClient');

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

        // Deduct mana cost
        const manaResult = await this.useMana(action.battlerId, actionData.manaCost);
        if (!manaResult.success) {
            return manaResult;
        }

        // Set cooldown based on ability's cooldown duration
        const cooldownKey = `cooldown:${action.battlerId}`;
        const currentTime = Date.now();
        const cooldownDuration = getCooldownDuration(actionData.cooldownDuration);

        const cooldownEndTime = await redisClientClient.get(cooldownKey);
        if (cooldownEndTime && currentTime < cooldownEndTime) {
            return {
                success: false,
                message: 'Ability is currently on cooldown',
                battlerId: action.battlerId,
                actionType: action.actionType,
                actionData: action.actionData
            };
        }

        await redisClient.set(cooldownKey, currentTime + cooldownDuration, 'PX', cooldownDuration);

        actionData.results = actionData.results || [];

        if (actionData.damage) {
            actionData.results.push(await this.doDamage(actionData.targetId, actionData.damage));
        }

        if (actionData.healing) {
            actionData.results.push(await this.doHealing(actionData.targetId, actionData.healing));
        }

        if (actionData.statusEffects) {
            for (let status of actionData.statusEffects) {
                actionData.results.push(await this.applyStatus(actionData.targetId, status));
            }
        }

        return {
            success: true,
            message: 'Ability action processed successfully',
            battlerId: action.battlerId,
            actionType: action.actionType,
            actionData: action.actionData
        };
    }

    /**
     * Deduct mana from a battler.
     * @param {number} battlerId - The ID of the battler.
     * @param {number} manaCost - The amount of mana to deduct.
     * @returns {Object} The result of the mana deduction.
     */
    static async useMana(battlerId, manaCost) {
        let battler = await getBattlerInstanceById(battlerId);
        if (!battler) {
            return {
                success: false,
                message: `Battler ${battlerId} not found`
            };
        }

        if (battler.currentStats.mana < manaCost) {
            return {
                success: false,
                message: `Insufficient mana for battler ${battlerId}`
            };
        }

        battler.currentStats.mana -= manaCost;
        await updateBattlerMana(battler.id, battler.currentStats.mana);

        return {
            success: true,
            message: `Deducted ${manaCost} mana from battler ${battlerId}`
        };
    }

    /**
     * Apply damage to a battler.
     * @param {number} targetId - The ID of the target battler.
     * @param {number} damage - The amount of damage to apply.
     * @returns {Object} The result of applying the damage.
     */
    static async doDamage(targetId, damage) {
        let target = await getBattlerInstanceById(targetId);
        if (!target) {
            return {
                success: false,
                message: `Battler ${targetId} not found`
            };
        }
        target.currentStats.health = Math.max(target.currentStats.health - damage, 0); // Clamp health to a minimum of 0
        await updateBattlerHealth(target.id, target.currentStats.health);

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
        let target = await getBattlerInstanceById(targetId);
        if (!target) {
            return {
                success: false,
                message: `Battler ${targetId} not found`
            };
        }
        target.currentStats.health = Math.min(target.currentStats.health + healing, target.baseStats.health); // Clamp health to a maximum of base health
        await updateBattlerHealth(target.id, target.currentStats.health);

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

        // Check cooldown from redisClient
        const cooldownEndTime = await redisClient.get(cooldownKey);

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
        
        // Set cooldown in redisClient
        const cooldownDuration = getCooldownDuration('short'); // Uses the short cooldown duration for movement
        await redisClient.set(cooldownKey, currentTime + cooldownDuration, 'PX', cooldownDuration);

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
