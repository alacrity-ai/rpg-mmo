const { getBattleInstanceById, deleteBattleInstance, getBattlerInstancesInBattle, updateBattleInstance } = require('../../db/queries/battleInstancesQueries');
const { updateAreaInstance } = require('../../db/queries/areaInstancesQueries');
const { createBattlerInstancesFromCharacterIds } = require('../../db/queries/battlerInstancesQueries');
const logger = require('../../utilities/logger');

class BattleManager {
    constructor() {
        // Any necessary initialization can go here
    }

    /**
     * Completes a battle, performs cleanup, and marks it as completed.
     * @param {number} battleId - The ID of the battle to complete.
     */
    async completeBattle(battleId) {
        const battleInstance = await getBattleInstanceById(battleId);

        if (!battleInstance) {
            throw new Error(`Battle instance with ID ${battleId} not found.`);
        }

        // Update the encounter_cleared column in the area instance
        const areaInstanceId = battleInstance.areaInstanceId;
        const areaInstanceData = { encounter_cleared: 1 };
        await updateAreaInstance(areaInstanceId, areaInstanceData);

        // Delete the battle instance
        await deleteBattleInstance(battleId);

        logger.info(`Completed and cleaned up battle with ID ${battleId}`);
    }

    /**
     * Allows a character to join an existing battle.
     * @param {number} battleId - The ID of the battle to join.
     * @param {number} characterId - The ID of the character joining the battle.
     */
    async addCharacterToBattle(battleId, characterId) {
        const newBattlerInstances = await createBattlerInstancesFromCharacterIds([characterId]);
        if (newBattlerInstances.length === 0) {
            throw new Error(`Failed to create battler instance for character with ID ${characterId}.`);
        }

        const newBattlerInstance = newBattlerInstances[0];
        const battleInstance = await getBattleInstanceById(battleId);
        if (!battleInstance) {
            throw new Error(`Battle instance with ID ${battleId} not found.`);
        }

        battleInstance.battlerIds.push(newBattlerInstance.id);
        await updateBattleInstance(battleId, { battler_ids: battleInstance.battlerIds });

        logger.info(`Character with ID ${characterId} joined battle with ID ${battleId}`);
        return newBattlerInstance;
    }

    /**
     * Determines the winner of a battle.
     * @param {number} battleId - The ID of the battle.
     * @returns {string} - The winning team ('player' or 'enemy'), or 'draw' if both teams are dead.
     */
    async getWinner(battleId) {
        const battlerInstances = await getBattlerInstancesInBattle(battleId);
        const playerTeamAlive = battlerInstances.some(battler => battler.team === 'player' && battler.currentStats.health > 0);
        const enemyTeamAlive = battlerInstances.some(battler => battler.team === 'enemy' && battler.currentStats.health > 0);

        if (playerTeamAlive && !enemyTeamAlive) {
            return 'player';
        } else if (!playerTeamAlive && enemyTeamAlive) {
            return 'enemy';
        } else if (!playerTeamAlive && !enemyTeamAlive) {
            return 'draw'; // Both teams are dead
        } else {
            return null; // Battle is still ongoing or no clear winner
        }
    }
}

module.exports = BattleManager;
