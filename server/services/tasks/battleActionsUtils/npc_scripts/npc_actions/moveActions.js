async function actionMove(battlerInstance, x, y) {
    const newPosition = [battlerInstance.gridPosition[0] + x, battlerInstance.gridPosition[1] + y];
    const actionData = {
        newPosition,
        currentPosition: battlerInstance.gridPosition,
        team: battlerInstance.team
    };
    const action = {
        battleInstanceId: battlerInstance.battleInstanceId,
        battlerId: battlerInstance.battlerInstanceId,
        actionType: 'move',
        actionData
    };
    const result = await battlerInstance.battleActionProcessor.processSingleAction(action);
    if (result.success) {
        battlerInstance.gridPosition = newPosition;
    }
    return result;
}

async function actionMoveFromEnemy(battlerInstance, battlerInstances) {
    const enemyTeam = battlerInstance.team === 'player' ? 'enemy' : 'player';
    const moveableArea = battlerInstance.team === 'player' ? { x: [0, 2], y: [0, 2] } : { x: [3, 5], y: [0, 2] };
    let nearestEnemy = null;
    let minDistance = Infinity;

    for (const battler of battlerInstances) {
        if (battler.team === enemyTeam) {
            const distance = Math.abs(battler.gridPosition[0] - battlerInstance.gridPosition[0]) +
                             Math.abs(battler.gridPosition[1] - battlerInstance.gridPosition[1]);
            if (distance < minDistance) {
                minDistance = distance;
                nearestEnemy = battler;
            }
        }
    }

    if (!nearestEnemy) {
        return {
            success: false,
            message: 'No enemy found',
            battlerId: battlerInstance.battlerInstanceId,
            actionType: 'move',
            actionData: null
        };
    }

    const direction = [
        -Math.sign(nearestEnemy.gridPosition[0] - battlerInstance.gridPosition[0]),
        -Math.sign(nearestEnemy.gridPosition[1] - battlerInstance.gridPosition[1])
    ];

    let newPosition = [
        battlerInstance.gridPosition[0] + direction[0],
        battlerInstance.gridPosition[1] + direction[1]
    ];

    // Adjust the position to be within the moveable area bounds
    if (newPosition[0] < moveableArea.x[0]) newPosition[0] = moveableArea.x[0];
    if (newPosition[0] > moveableArea.x[1]) newPosition[0] = moveableArea.x[1];
    if (newPosition[1] < moveableArea.y[0]) newPosition[1] = moveableArea.y[0];
    if (newPosition[1] > moveableArea.y[1]) newPosition[1] = moveableArea.y[1];

    if (
        newPosition[0] === battlerInstance.gridPosition[0] &&
        newPosition[1] === battlerInstance.gridPosition[1]
    ) {
        return {
            success: false,
            message: 'No movement occurred',
            battlerId: battlerInstance.battlerInstanceId,
            actionType: 'move',
            actionData: null
        };
    }

    return await actionMove(battlerInstance, newPosition[0] - battlerInstance.gridPosition[0], newPosition[1] - battlerInstance.gridPosition[1]);
}

async function actionMoveToEnemy(battlerInstance, battlerInstances) {
    const enemyTeam = battlerInstance.team === 'player' ? 'enemy' : 'player';
    const moveableArea = battlerInstance.team === 'player' ? { x: [0, 2], y: [0, 2] } : { x: [3, 5], y: [0, 2] };
    let nearestEnemy = null;
    let minDistance = Infinity;

    for (const battler of battlerInstances) {
        if (battler.team === enemyTeam) {
            const distance = Math.abs(battler.gridPosition[0] - battlerInstance.gridPosition[0]) +
                             Math.abs(battler.gridPosition[1] - battlerInstance.gridPosition[1]);
            if (distance < minDistance) {
                minDistance = distance;
                nearestEnemy = battler;
            }
        }
    }

    if (!nearestEnemy) {
        return {
            success: false,
            message: 'No enemy found',
            battlerId: battlerInstance.battlerInstanceId,
            actionType: 'move',
            actionData: null
        };
    }

    const direction = [
        Math.sign(nearestEnemy.gridPosition[0] - battlerInstance.gridPosition[0]),
        Math.sign(nearestEnemy.gridPosition[1] - battlerInstance.gridPosition[1])
    ];

    let newPosition = [
        battlerInstance.gridPosition[0] + direction[0],
        battlerInstance.gridPosition[1] + direction[1]
    ];

    // Adjust the position to be within the moveable area bounds
    if (newPosition[0] < moveableArea.x[0]) newPosition[0] = moveableArea.x[0];
    if (newPosition[0] > moveableArea.x[1]) newPosition[0] = moveableArea.x[1];
    if (newPosition[1] < moveableArea.y[0]) newPosition[1] = moveableArea.y[0];
    if (newPosition[1] > moveableArea.y[1]) newPosition[1] = moveableArea.y[1];

    if (
        newPosition[0] === battlerInstance.gridPosition[0] &&
        newPosition[1] === battlerInstance.gridPosition[1]
    ) {
        return {
            success: false,
            message: 'No movement occurred',
            battlerId: battlerInstance.battlerInstanceId,
            actionType: 'move',
            actionData: null
        };
    }

    return await actionMove(battlerInstance, newPosition[0] - battlerInstance.gridPosition[0], newPosition[1] - battlerInstance.gridPosition[1]);
}

async function actionMoveToDestination(battlerInstance, destinationX, destinationY) {
    const moveableArea = battlerInstance.team === 'player' ? { x: [0, 2], y: [0, 2] } : { x: [3, 5], y: [0, 2] };

    // Check if the destination is out of bounds
    if (
        destinationX < moveableArea.x[0] || destinationX > moveableArea.x[1] ||
        destinationY < moveableArea.y[0] || destinationY > moveableArea.y[1]
    ) {
        return {
            success: false,
            message: 'Destination out of bounds',
            battlerId: battlerInstance.battlerInstanceId,
            actionType: 'move',
            actionData: null
        };
    }

    // Check if the battler is already at the destination
    if (
        battlerInstance.gridPosition[0] === destinationX &&
        battlerInstance.gridPosition[1] === destinationY
    ) {
        return {
            success: false,
            message: 'Already at the destination',
            battlerId: battlerInstance.battlerInstanceId,
            actionType: 'move',
            actionData: null
        };
    }

    const direction = [
        Math.sign(destinationX - battlerInstance.gridPosition[0]),
        Math.sign(destinationY - battlerInstance.gridPosition[1])
    ];

    return await actionMove(battlerInstance, direction[0], direction[1]);
}

async function actionMoveToBattler(battlerInstance, targetBattlerInstance) {
    const moveableArea = battlerInstance.team === 'player' ? { x: [0, 2], y: [0, 2] } : { x: [3, 5], y: [0, 2] };

    const destinationX = targetBattlerInstance.gridPosition[0];
    const destinationY = targetBattlerInstance.gridPosition[1];

    // Check if the destination is out of bounds
    if (
        destinationX < moveableArea.x[0] || destinationX > moveableArea.x[1] ||
        destinationY < moveableArea.y[0] || destinationY > moveableArea.y[1]
    ) {
        return {
            success: false,
            message: 'Destination out of bounds',
            battlerId: battlerInstance.battlerInstanceId,
            actionType: 'move',
            actionData: null
        };
    }

    // Check if the battler is already at the destination
    if (
        battlerInstance.gridPosition[0] === destinationX &&
        battlerInstance.gridPosition[1] === destinationY
    ) {
        return {
            success: false,
            message: 'Already at the destination',
            battlerId: battlerInstance.battlerInstanceId,
            actionType: 'move',
            actionData: null
        };
    }

    const direction = [
        Math.sign(destinationX - battlerInstance.gridPosition[0]),
        Math.sign(destinationY - battlerInstance.gridPosition[1])
    ];

    const newPosition = [
        battlerInstance.gridPosition[0] + direction[0],
        battlerInstance.gridPosition[1] + direction[1]
    ];

    // Adjust the position to be within the moveable area bounds
    if (newPosition[0] < moveableArea.x[0]) newPosition[0] = moveableArea.x[0];
    if (newPosition[0] > moveableArea.x[1]) newPosition[0] = moveableArea.x[1];
    if (newPosition[1] < moveableArea.y[0]) newPosition[1] = moveableArea.y[0];
    if (newPosition[1] > moveableArea.y[1]) newPosition[1] = moveableArea.y[1];

    if (
        newPosition[0] === battlerInstance.gridPosition[0] &&
        newPosition[1] === battlerInstance.gridPosition[1]
    ) {
        return {
            success: false,
            message: 'No movement occurred',
            battlerId: battlerInstance.battlerInstanceId,
            actionType: 'move',
            actionData: null
        };
    }

    return await actionMove(battlerInstance, direction[0], direction[1]);
}

module.exports = {
    actionMove,
    actionMoveToEnemy,
    actionMoveFromEnemy,
    actionMoveToDestination,
    actionMoveToBattler
};
