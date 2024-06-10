const { getBattleInstanceById, deleteBattleInstance, getBattlerInstancesInBattle, updateBattleInstance } = require('../../db/queries/battleInstancesQueries');
const { updateAreaInstance } = require('../../db/queries/areaInstancesQueries');
const { createBattlerInstancesFromCharacterIds } = require('../../db/queries/battlerInstancesQueries');
const { deleteCacheBattleInstance, setCacheBattleInstance, getCacheBattlerInstance, setCacheBattlerInstance, getCacheBattleInstance } = require('../../db/cache/helpers/battleHelper');
const logger = require('../../utilities/logger');

class BattleManager {
    constructor(redisClient) {
        this.redisClient = redisClient;
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
        console.log('newBattlerInstance:', newBattlerInstance);
        const battleInstance = await getBattleInstanceById(battleId);
        if (!battleInstance) {
            throw new Error(`Battle instance with ID ${battleId} not found.`);
        }

        battleInstance.battlerIds.push(newBattlerInstance.id);
        await updateBattleInstance(battleId, { battler_ids: battleInstance.battlerIds });

        // Update cache
        const cachedBattleInstance = await getCacheBattleInstance(this.redisClient, battleId);
        if (cachedBattleInstance) {
            if (!cachedBattleInstance.battlerIds.includes(newBattlerInstance.id)) {
                cachedBattleInstance.battlerIds.push(newBattlerInstance.id);
                await setCacheBattleInstance(this.redisClient, cachedBattleInstance);
            }
        } else {
            await setCacheBattleInstance(this.redisClient, battleInstance);
        }

        const cachedBattlerInstance = await getCacheBattlerInstance(this.redisClient, battleId, newBattlerInstance.id);
        if (!cachedBattlerInstance) {
            await setCacheBattlerInstance(this.redisClient, newBattlerInstance, battleId);
        }

        logger.info(`Character with ID ${characterId} joined battle with ID ${battleId}`);
        return newBattlerInstance;
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
        this.cleanupBattle(battleId);
    }

    /**
     * Cleans up a battle
     * @param {number} battleId - The ID of the battle to clean up.
     */
    async cleanupBattle(battleId) {
        // Delete the battle instance
        await deleteBattleInstance(battleId);

        // Delete cache information related to battlers in the cache
        await deleteCacheBattleInstance(this.redisClient, battleId);

        logger.info(`Cleaned up battle with ID ${battleId}`);
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
