const logger = require('../../../utilities/logger');
const { callbackMap } = require('./taskUtils');

function processTaskResult(io, taskId, taskResult) {  
  // Retrieve the callback from the map
  const callback = callbackMap.get(taskId);
  
  // Call the callback with the result
  if (callback) {
    if (taskResult.success) {
      callback(taskResult);
    } else {
      logger.error(`Task failed: ${taskResult.error}`);
      callback({ success: false, error: taskResult.error });
    }
    // Remove the callback from the map
    callbackMap.delete(taskId);
  }

  // Emit to battle room if applicable
  // Only for processRunScriptActionTask (for NPCs actions), and processAddBattlerActionTask (for player actions)
  if (taskResult.data && taskResult.data.actionResult) {
    const battleInstanceId = taskResult.data.battleInstanceId;
    const battleWinner = taskResult.data.actionResult.battleWinner;
    if (battleWinner) {
      io.to(`battle-${battleInstanceId}`).emit('battleCompleted', battleWinner);
    } else {
      io.to(`battle-${battleInstanceId}`).emit('completedBattlerAction', taskResult.data.actionResult);
    }
  }

  // Emit battlerJoined event if a new battler has joined
  if (taskResult.data && taskResult.data.newBattlerJoined) {
    const battleInstanceId = taskResult.data.battleInstance.id;
    io.to(`battle-${battleInstanceId}`).emit('battlerJoined', {
      battlerId: taskResult.data.newBattlerInstance.id,
      battleInstanceData: taskResult.data.battleInstance,
      battlerInstancesData: taskResult.data.battlerInstances
    });
  }

  // Emit battlerLeft event if a battler has left
  if (taskResult.data && taskResult.data.battlerLeft) {
    const { leftBattlerIds, battleInstanceIds, battleInstances } = taskResult.data;
    
    battleInstanceIds.forEach((battleInstanceId, index) => {
      io.to(`battle-${battleInstanceId}`).emit('battlerLeft', {
        battlerIds: leftBattlerIds,
        battleInstanceData: battleInstances[index],
        battlerInstancesData: battleInstances[index].battlerIds
      });
    });
  }

}

module.exports = {
  processTaskResult
};
