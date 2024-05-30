const Redis = require('ioredis');
const {
    createBattlerInstancesFromCharacterIds,
    createBattlerInstancesFromNPCTemplateIds,
    getBattlerInstanceById,
    updateBattlerInstance,
    deleteBattlerInstance,
    instanceCanAct
} = require('../../db/queries/battlerInstancesQueries');
const taskRegistry = require('../server/taskRegistry');
const logger = require('../../utilities/logger');
const redis = new Redis();

async function processCreateBattlerFromCharacterTask(task) {
    const { taskId, data } = task.taskData;
    const { characterIds } = data;

    try {
        const battlerInstanceIds = await createBattlerInstancesFromCharacterIds(characterIds);

        const result = { success: true, data: battlerInstanceIds };
        logger.info(`Battler creation from character successful for task ${taskId}`);
        await redis.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
    } catch (error) {
        const result = { error: 'Failed to create battler from character. ' + error.message };
        logger.error(`Battler creation from character failed for task ${taskId}:`, error.message);
        await redis.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
    }
}

async function processCreateBattlerFromNPCTask(task) {
    const { taskId, data } = task.taskData;
    const { npcTemplateIds } = data;

    try {
        const battlerInstanceIds = await createBattlerInstancesFromNPCTemplateIds(npcTemplateIds);

        const result = { success: true, data: battlerInstanceIds };
        logger.info(`Battler creation from NPC successful for task ${taskId}`);
        await redis.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
    } catch (error) {
        const result = { error: 'Failed to create battler from NPC. ' + error.message };
        logger.error(`Battler creation from NPC failed for task ${taskId}:`, error.message);
        await redis.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
    }
}

async function processGetBattlerTask(task) {
    const { taskId, data } = task.taskData;
    const { battlerId } = data;

    try {
        const battlerInstance = await getBattlerInstanceById(battlerId);

        if (!battlerInstance) {
            const result = { error: 'Battler not found.' };
            logger.info(`Battler not found for task ${taskId}`);
            await redis.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
            return;
        }

        const result = { success: true, data: battlerInstance };
        logger.info(`Battler retrieval successful for task ${taskId}`);
        await redis.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
    } catch (error) {
        const result = { error: 'Failed to retrieve battler. ' + error.message };
        logger.error(`Battler retrieval failed for task ${taskId}:`, error.message);
        await redis.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
    }
}

async function processUpdateBattlerTask(task) {
    const { taskId, data } = task.taskData;
    const { battlerId, updates } = data;

    try {
        await updateBattlerInstance(battlerId, updates);

        const result = { success: true };
        logger.info(`Battler update successful for task ${taskId}`);
        await redis.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
    } catch (error) {
        const result = { error: 'Failed to update battler. ' + error.message };
        logger.error(`Battler update failed for task ${taskId}:`, error.message);
        await redis.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
    }
}

async function processDeleteBattlerTask(task) {
    const { taskId, data } = task.taskData;
    const { battlerId } = data;

    try {
        await deleteBattlerInstance(battlerId);

        const result = { success: true };
        logger.info(`Battler deletion successful for task ${taskId}`);
        await redis.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
    } catch (error) {
        const result = { error: 'Failed to delete battler. ' + error.message };
        logger.error(`Battler deletion failed for task ${taskId}:`, error.message);
        await redis.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
    }
}

async function processCanBattlerActTask(task) {
    const { taskId, data } = task.taskData;
    const { battlerId } = data;

    try {
        const canAct = await instanceCanAct(battlerId);

        const result = { success: true, data: { canAct } };
        logger.info(`Battler action check successful for task ${taskId}`);
        await redis.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
    } catch (error) {
        const result = { error: 'Failed to check if battler can act. ' + error.message };
        logger.error(`Battler action check failed for task ${taskId}:`, error.message);
        await redis.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
    }
}

// Register task handlers
taskRegistry.register('createBattlerFromCharacter', processCreateBattlerFromCharacterTask);
taskRegistry.register('createBattlerFromNPC', processCreateBattlerFromNPCTask);
taskRegistry.register('getBattler', processGetBattlerTask);
taskRegistry.register('updateBattler', processUpdateBattlerTask);
taskRegistry.register('deleteBattler', processDeleteBattlerTask);
taskRegistry.register('canBattlerAct', processCanBattlerActTask);

module.exports = {
    processCreateBattlerFromCharacterTask,
    processCreateBattlerFromNPCTask,
    processGetBattlerTask,
    processUpdateBattlerTask,
    processDeleteBattlerTask,
    processCanBattlerActTask,
};
