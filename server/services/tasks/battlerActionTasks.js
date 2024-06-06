const { redisClient } = require('../../redisClient');
const taskRegistry = require('../../handlers/taskRegistry');
const logger = require('../../utilities/logger');
const BattleActionProcessor = require('./battleActionsUtils/BattleActionProcessor');

async function processAddBattlerActionTask(task) {
    const { taskId, data } = task.taskData;
    const { battleInstanceId, battlerId, actionType, actionData } = data;

    try {
        // Process the action immediately
        const actionResult = await BattleActionProcessor.processSingleAction({ battleInstanceId, battlerId, actionType, actionData });
        if (actionResult.success) {
            const result = { success: true, data: { battleInstanceId, actionResult } };
            logger.info(`Battler action processed successfully for task ${taskId}`);
            await redisClient.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
        } else {
            throw new Error(actionResult.message);
        }
    } catch (error) {
        const result = { error: 'Failed to process battler action. ' + error.message };
        logger.error(`Processing battler action failed for task ${taskId}:`, error.message);
        await redisClient.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
    }
}

// Register task handlers
taskRegistry.register('addBattlerAction', processAddBattlerActionTask);

module.exports = {
    processAddBattlerActionTask
};
