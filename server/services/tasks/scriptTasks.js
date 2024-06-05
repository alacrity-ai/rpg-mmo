const Redis = require('ioredis');
const redis = new Redis();
const taskRegistry = require('../../handlers/taskRegistry');
const logger = require('../../utilities/logger');
const { enqueueTask } = require('../../handlers/taskUtils');
const { getBattlerInstancesInBattle } = require('../../db/queries/battleInstancesQueries');
const NPCScriptExecutor = require('./battleActionsUtils/NpcScriptExecutor');

async function processRunScriptActionTask(task) {
    const { taskId, data } = task;
    const { battleInstanceId, battlerId } = data;
    try {
        const battlerInstances = await getBattlerInstancesInBattle(battleInstanceId);
        const battlerInstance = battlerInstances.find(bi => bi.id === battlerId);
        if (!battlerInstance) {
            throw new Error(`Battler instance with ID ${battlerId} not found in battle instance ${battleInstanceId}`);
        }

        const npcScriptExecutor = new NPCScriptExecutor(battlerInstance, battlerInstances, battleInstanceId);

        // Run the script and get the result
        const actionResult = await npcScriptExecutor.runScript();

        // Enqueue the next script action task
        const nextTaskData = { battleInstanceId, battlerId };
        // TODO : Have the delay be handled by the NPC script itself
        const delay = 2500; // Example delay
        await enqueueTask('runScriptAction', nextTaskData, () => {
            logger.info(`Next script action enqueued for battler ${battlerId}`);
        }, null, delay);

        if (actionResult.success) {
            const result = { success: true, data: { battleInstanceId, actionResult } };
            logger.info(`RunScriptAction task processed successfully for task ${taskId}`);
            await redis.publish('npc-task-result', JSON.stringify({ taskId, result }));
        } else {
            throw new Error(actionResult.message);
        }

    } catch (error) {
        const result = { error: 'Failed to process runScriptAction task. ' + error.message };
        logger.error(`Processing runScriptAction task failed for task ${taskId}: ${error.message}`);
        await redis.publish('npc-task-result', JSON.stringify({ taskId, result }));
    }
}

// Register task handlers
taskRegistry.register('runScriptAction', processRunScriptActionTask);

module.exports = {
    processRunScriptActionTask
};
