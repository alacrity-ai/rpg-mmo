const Redis = require('ioredis');
const taskRegistry = require('../server/taskRegistry');
const logger = require('../../utilities/logger');
const redis = new Redis();
const BattleActionProcessor = require('../../services/tasks/battleActionsUtils/BattleActionProcessor');

async function processAddBattlerActionTask(task) {
    const { taskId, data } = task.taskData;
    const { battleInstanceId, battlerId, actionType, actionData } = data;

    try {
        // Process the action immediately
        const actionResult = await BattleActionProcessor.processSingleAction({ battleInstanceId, battlerId, actionType, actionData });

        const result = { success: true, data: { battleInstanceId, actionResult } };
        logger.info(`Battler action processed successfully for task ${taskId}`);
        await redis.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
    } catch (error) {
        const result = { error: 'Failed to process battler action. ' + error.message };
        logger.error(`Processing battler action failed for task ${taskId}:`, error.message);
        await redis.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
    }
}

// Register task handlers
taskRegistry.register('addBattlerAction', processAddBattlerActionTask);

module.exports = {
    processAddBattlerActionTask
};
