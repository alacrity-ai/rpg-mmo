const Redis = require('ioredis');
const BattleCreator = require('../../services/expeditions/battleCreator');
const { getAreaInstanceById } = require('../../db/queries/areaInstancesQueries');
const taskRegistry = require('../../handlers/taskRegistry');
const logger = require('../../utilities/logger');
const redis = new Redis();

async function processGetBattleInstanceTask(task) {
    const { taskId, data } = task.taskData;
    const { areaId, characterId } = data;

    try {
        // Fetch the area instance to get the encounter template ID
        const areaInstance = await getAreaInstanceById(areaId);
        if (!areaInstance) {
            throw new Error(`Area instance with ID ${areaId} not found.`);
        }
        const encounterTemplateId = areaInstance.encounter;
        // If no encounter is set, throw an error
        if (!encounterTemplateId) {
            throw new Error(`No encounter set for area instance with ID ${areaId}.`);
        }

        // Initialize the BattleCreator with the given parameters
        const battleCreator = new BattleCreator(characterId, encounterTemplateId, areaId);
        const response = await battleCreator.execute();

        const result = { success: true, data: response };
        logger.info(`Battle instance retrieval or creation successful for task ${taskId}`);
        await redis.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
    } catch (error) {
        const result = { error: 'Failed to retrieve or create battle instance. ' + error.message };
        logger.error(`Battle instance retrieval or creation failed for task ${taskId}:`, error.message);
        await redis.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
    }
}

async function processStartBattlerScriptsTask(task) {
    console.log('TASK: ', task);
    const { taskId, data: taskData } = task;
    const { battleInstance, battlerInstances } = taskData.data;

    try {
        // For now, just log the start of battler scripts
        logger.info(`Battler scripts started for battle instance ${battleInstance.id}`);

        const result = { success: true, data: { battleInstanceId: battleInstance.id } };
        await redis.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
    } catch (error) {
        const result = { error: 'Failed to start battler scripts. ' + error.message };
        logger.error(`Failed to start battler scripts for task ${taskId}:`, error.message);
        await redis.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
    }
}

// Register task handlers
taskRegistry.register('getBattleInstance', processGetBattleInstanceTask);
taskRegistry.register('startBattlerScripts', processStartBattlerScriptsTask);

module.exports = {
    processGetBattleInstanceTask,
    processStartBattlerScriptsTask
};
