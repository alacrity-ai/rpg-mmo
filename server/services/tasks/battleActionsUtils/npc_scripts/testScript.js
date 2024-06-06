const NpcScript = require('./NpcScript');

class TestScript extends NpcScript {
    constructor(battlerInstance, battlerInstances, battleInstanceId) {
        super(battlerInstance, battlerInstances, battleInstanceId);
    }

    async phase0() {
        const actionResult = await this.actionMoveToEnemy();
        if (!this.actionFailed(actionResult)) {
            await this.updatePhase(1);
        }
        return actionResult;
    }

    async phase1() {
        const actionResult = await this.actionMoveFromEnemy();
        if (!this.actionFailed(actionResult)) {
            await this.updatePhase(2);
        }
        return actionResult;
    }

    async phase2() {
        const actionResult = await this.actionMoveToEnemy();
        if (!this.actionFailed(actionResult)) {
            await this.updatePhase(3);
        }
        return actionResult;
    }

    async phase3() {
        const actionResult = await this.actionMoveToEnemy();
        if (!this.actionFailed(actionResult)) {
            await this.updatePhase(0);
        }
        return actionResult;
    }
}

module.exports = TestScript;
