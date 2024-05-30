const Redis = require('ioredis');
const { createBattleWithCharactersAndNPCs, getBattleInstanceById, getAllBattleInstances, deleteBattleInstance, getBattlersInBattle } = require('../../db/queries/battleInstancesQueries');
const taskRegistry = require('../server/taskRegistry');
const logger = require('../../utilities/logger');
const redis = new Redis();

async function processCreateBattleTask(task) {
    const { taskId, data } = task.taskData;
    const { characterIds, npcTemplateIds } = data;

    try {
        // Create the battle with characters and NPCs
        const battleInstanceId = await createBattleWithCharactersAndNPCs(characterIds, npcTemplateIds);

        const result = { success: true, data: { battleInstanceId } };
        logger.info(`Battle creation successful for task ${taskId}`);
        await redis.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
    } catch (error) {
        const result = { error: 'Failed to create battle. ' + error.message };
        logger.error(`Battle creation failed for task ${taskId}:`, error.message);
        await redis.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
    }
}

async function processGetBattleTask(task) {
    const { taskId, data } = task.taskData;
    const { battleId } = data;

    try {
        const battleInstance = await getBattleInstanceById(battleId);

        if (!battleInstance) {
            const result = { error: 'Battle not found.' };
            logger.info(`Battle not found for task ${taskId}`);
            await redis.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
            return;
        }

        const result = { success: true, data: battleInstance };
        logger.info(`Battle retrieval successful for task ${taskId}`);
        await redis.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
    } catch (error) {
        const result = { error: 'Failed to retrieve battle. ' + error.message };
        logger.error(`Battle retrieval failed for task ${taskId}:`, error.message);
        await redis.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
    }
}

async function processGetAllBattlesTask(task) {
    const { taskId } = task.taskData;

    try {
        const battles = await getAllBattleInstances();

        const result = { success: true, data: battles };
        logger.info(`All battles retrieval successful for task ${taskId}`);
        await redis.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
    } catch (error) {
        const result = { error: 'Failed to retrieve all battles. ' + error.message };
        logger.error(`All battles retrieval failed for task ${taskId}:`, error.message);
        await redis.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
    }
}

async function processDeleteBattleTask(task) {
    const { taskId, data } = task.taskData;
    const { battleId } = data;

    try {
        await deleteBattleInstance(battleId);

        const result = { success: true };
        logger.info(`Battle deletion successful for task ${taskId}`);
        await redis.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
    } catch (error) {
        const result = { error: 'Failed to delete battle. ' + error.message };
        logger.error(`Battle deletion failed for task ${taskId}:`, error.message);
        await redis.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
    }
}

async function processGetBattlersInBattleTask(task) {
    const { taskId, data } = task.taskData;
    const { battleId } = data;

    try {
        const battlers = await getBattlersInBattle(battleId);

        const result = { success: true, data: battlers };
        logger.info(`Battlers in battle retrieval successful for task ${taskId}`);
        await redis.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
    } catch (error) {
        const result = { error: 'Failed to retrieve battlers in battle. ' + error.message };
        logger.error(`Battlers in battle retrieval failed for task ${taskId}:`, error.message);
        await redis.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
    }
}

// Register task handlers
taskRegistry.register('createBattle', processCreateBattleTask);
taskRegistry.register('getBattle', processGetBattleTask);
taskRegistry.register('getAllBattles', processGetAllBattlesTask);
taskRegistry.register('deleteBattle', processDeleteBattleTask);
taskRegistry.register('getBattlersInBattle', processGetBattlersInBattleTask);

module.exports = {
    processCreateBattleTask,
    processGetBattleTask,
    processGetAllBattlesTask,
    processDeleteBattleTask,
    processGetBattlersInBattleTask,
};
