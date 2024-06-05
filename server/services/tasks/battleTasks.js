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
    const { taskId, data: taskData } = task;
    const { battleInstance, battlerInstances } = taskData.data;

    try {
        // For now, just log the start of battler scripts
        logger.info(`Battler scripts started for battle instance ${battleInstance.id}`);
        // Implement logic to look through battlerInstances and enqueue a runScriptAction task for each battler
        // We'll need a BattlerScriptRunner class to handle this
        // BattlerScriptRunner runScript method will take the battleInstance, and a battlerInstance as inputs
        // It will import the script designated by the battlerInstance.scriptPath, and run it, making sure that the script has the necessary
        //     information, like the BattleInstance.  The BattleScriptRunner also has access to the BattlerInstances table, where it can get the current "phase" of the BattlerInstance.
        //     An NPC script is a list of actions, each associated with a phase number.  This script will run the action for the first phase.
        //     The script action in the first phase might, for example, have the NPC move down a tile, then increment the BattlerInstance.phase.
        //     The BattlerScriptRunner will leverage the BattleActionProcessor (BAP)
        //     to process actions.  The BattleScriptRunner, after getting the result from the BAP, will publish the result
        //     in the task-result channel, with an appropriate taskId and the result object.
        //     The BattlerScriptRunner should also enqueue another delayed task for the next execution of that battler's script. (e.g. in 3 seconds)
        //     When this enqueued task is processed, if for example the script incremented the BattlerInstance.phase, then the next action in the script will be executed on the next rotation.
        // The server should see the completed task, and emit the result to all the clients in the 'battle-<battleInstanceId>' room.
        // NOTE: Keep in mind, that each execution of the script, 
        // Note: If we consider this action to be the script tick, then all the NPCs we'll be synced,
        //   therefore, we may just use this action to set discrete script run actions for each NPC,
        //   and another action handler will actually instantiate the BattleScriptRunner, for 1 NPC at a time.
        //   e.g. 1 queued delayed task per NPC.

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
