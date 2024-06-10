const { updateBattlerPosition, updateBattlerHealth, updateBattlerMana, applyStatusEffect, getBattlerInstanceById, getBattlerInstancesByIds } = require('../../../db/queries/battlerInstancesQueries');
const { getCooldownDuration } = require('../../../utilities/helpers');

class BattleActionProcessor {
    // Constructor which takes a redisClient as an argument
    constructor(redisClient) {
        this.redisClient = redisClient;
    }

    /**
     * Process a single battler action.
     * @param {Object} action - The action to process.
     * @returns {Object} The result of processing the action.
     */
    async processSingleAction(action) {
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
    async processAbilityAction(action) {
        const { battleInstanceId, battlerId, actionType, actionData } = action;
        const { abilityTemplate, targetTiles, targetBattlerIds } = actionData
        console.log(`BAP: Got values: ${battleInstanceId}, ${battlerId}, ${actionType}, ${actionData}`)
        console.log(`BAP: Extracted values: ${abilityTemplate}, ${targetTiles}, ${targetBattlerIds}`)

        // Get up to date information from the Database about the battler using the ability and target battlers
        const userBattlerInstance = await getBattlerInstanceById(battlerId);
        const targetBattlerInstances = await getBattlerInstancesByIds(targetBattlerIds);

        // Deduct mana cost
        const manaResult = await this.useMana(userBattlerInstance, actionData.manaCost);
        if (!manaResult.success) {
            return manaResult;
        }
        console.log('BAP: Mana deducted successfully')

        // Set cooldown based on ability's cooldown duration
        const cooldownKey = `cooldown:${action.battlerId}`;
        const currentTime = Date.now();
        const cooldownDuration = getCooldownDuration(actionData.cooldownDuration);
        const cooldownEndTime = await this.redisClient.get(cooldownKey);
        if (cooldownEndTime && currentTime < cooldownEndTime) {
            return {
                success: false,
                message: 'Ability is currently on cooldown',
                battlerId: action.battlerId,
                actionType: action.actionType,
                actionData: action.actionData
            };
        }
        await this.redisClient.set(cooldownKey, currentTime + cooldownDuration, 'PX', cooldownDuration);
        console.log('BAP: Cooldown processed')

        // Instantiate the ability script
        const battleScriptModule = require(`./ability_scripts/${abilityTemplate.scriptPath}`)
        const abilityScript = new battleScriptModule(userBattlerInstance, targetBattlerInstances, battleInstanceId);
        console.log('BAP: Ability script instantiated')

        // Get the proposed actionEffects from the abilityScript
        // execute() method should return an object with any number of these keys: damage, healing, status
        const actionEffects = await abilityScript.execute();
        const { damage, healing, status } = actionEffects;
        console.log(`BAP: Action effects calculated: damage: ${damage}, healing: ${healing}, status: ${status}`)

        // Apply the effects from the script
        actionData.results = actionData.results || [];
        for (let targetInstance of targetBattlerInstances) {
            if (damage) {
                console.log(`BAP: Applying damage to target ${targetInstance.id}`)
                actionData.results.push(await this.doDamage(targetInstance, damage));
            }
            if (healing) {
                console.log(`BAP: Applying healing to target ${targetInstance.id}`)
                actionData.results.push(await this.doHealing(targetInstance, healing));
            }
            if (status) {
                console.log(`BAP: Applying status to target ${targetInstance.id}`)
                actionData.results.push(await this.applyStatus(targetInstance, status));
            }
        }

        console.log(`BAP: Returning results: success: true, message: 'Ability action processed successfully', battlerId: ${action.battlerId}, actionType: ${action.actionType}, actionData: ${action.actionData}`)
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
    async useMana(battlerInstance, manaCost) {
        if (!battlerInstance) {
            return {
                success: false,
                message: `Battler not found`
            };
        }

        if (battlerInstance.currentStats.mana < manaCost) {
            return {
                success: false,
                message: `Insufficient mana for battler ${battlerInstance.id}`
            };
        }

        battlerInstance.currentStats.mana -= manaCost;
        await updateBattlerMana(battlerInstance.id, battlerInstance.currentStats.mana);

        return {
            success: true,
            type: 'mana',
            statAdjustments: { mana: battlerInstance.currentStats.mana },
            message: `Deducted ${manaCost} mana from battler ${battlerInstance.id}`
        };
    }

    /**
     * Apply damage to a battler.
     * @param {number} targetId - The ID of the target battler.
     * @param {number} damage - The amount of damage to apply.
     * @returns {Object} The result of applying the damage.
     */
    async doDamage(battlerInstance, damage) {
        if (!battlerInstance) {
            return {
                success: false,
                message: `Battler not found`
            };
        }
        battlerInstance.currentStats.health = Math.max(battlerInstance.currentStats.health - damage, 0); // Clamp health to a minimum of 0
        
        // Update the battlerInstance in the database
        await updateBattlerHealth(battlerInstance.id, battlerInstance.currentStats.health);

        return {
            success: true,
            type: 'damage',
            statAdjustments: { health: battlerInstance.currentStats.health},
            message: `Applied ${damage} damage to battler ${battlerInstance.id}`
        };
    }

    /**
     * Apply healing to a battler.
     * @param {number} targetId - The ID of the target battler.
     * @param {number} healing - The amount of healing to apply.
     * @returns {Object} The result of applying the healing.
     */
    async doHealing(battlerInstance, healing) {
        if (!battlerInstance) {
            return {
                success: false,
                message: `Battler not found`
            };
        }
        battlerInstance.currentStats.health = Math.min(battlerInstance.currentStats.health + healing, battlerInstance.baseStats.health); // Clamp health to a maximum of base health
        await updateBattlerHealth(battlerInstance.id, battlerInstance.currentStats.health);

        return {
            success: true,
            type: 'healing',
            statAdjustments: { health: battlerInstance.currentStats.health },
            message: `Applied ${healing} healing to battler ${battlerInstance.id}`
        };
    }

    /**
     * Apply a status effect to a battler.
     * @param {number} targetId - The ID of the target battler.
     * @param {string} status - The status effect to apply.
     * @returns {Object} The result of applying the status effect.
     */
    async applyStatus(targetId, status) {
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
    async processMoveAction(action) {
        const team = action.actionData.team || 'enemy';
        const cooldownKey = `cooldown:${action.battlerId}`;
        const currentTime = Date.now();

        // Check cooldown from redisClient
        const cooldownEndTime = await this.redisClient.get(cooldownKey);

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
        await this.redisClient.set(cooldownKey, currentTime + cooldownDuration, 'PX', cooldownDuration - 100);

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
    async processItemAction(action) {
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
