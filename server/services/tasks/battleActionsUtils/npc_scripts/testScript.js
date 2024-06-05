const NpcScript = require('./NpcScript');

class TestScript extends NpcScript {
    constructor(battlerInstance, battlerInstances, battleInstanceId) {
        super(battlerInstance, battlerInstances, battleInstanceId);
    }

    async phase0() {
        // Move right a tile
        const actionResult = await this.actionMove(1, 0);
        this.updatePhase(1);
        return actionResult;
    }

    async phase1() {
        const actionResult = await this.actionMove(-1, 0);
        this.updatePhase(0);
        return actionResult;
    }

    // async phase1() {
    //     // Attack
    //     const target = this.findTarget();
    //     const actionData = {
    //         type: 'ability',
    //         target
    //     };
    //     return await BattleActionProcessor.processSingleAction({
    //         battleInstanceId: this.battleInstanceId,
    //         battlerId: this.battlerId,
    //         actionType: 'ability',
    //         actionData
    //     });
    // }

    // async phase2() {
    //     // Move up a tile
    //     const actionData = {
    //         type: 'move',
    //         newPosition: [this.gridPosition[0], this.gridPosition[1] - 1]
    //     };
    //     return await BattleActionProcessor.processSingleAction({
    //         battleInstanceId: this.battleInstanceId,
    //         battlerId: this.battlerId,
    //         actionType: 'move',
    //         actionData
    //     });
    // }

    // findTarget() {
    //     // Logic to find a target
    // }
}

module.exports = TestScript;
