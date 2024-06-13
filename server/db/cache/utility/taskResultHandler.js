const logger = require('../../../utilities/logger');
const { callbackMap } = require('./taskUtils');

function processTaskResult(io, taskId, taskResult, socket) {  
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

  // Emit action results to battle room if applicable
  if (taskResult.data && taskResult.data.actionResult) {
      const battleInstanceId = taskResult.data.battleInstanceId;
      io.to(`battle-${battleInstanceId}`).emit('completedBattlerAction', taskResult.data.actionResult);
  }

  // Emit battleCompleted event if a battle has completed
  if (taskResult.data && taskResult.data.battleResult) {
    const { battleResult, battleInstanceId } = taskResult.data;
    if (battleResult) {
      console.log('Battle completed:', battleResult)
      io.to(`battle-${battleInstanceId}`).emit('battleCompleted', { battleResult, battleInstanceId });
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
