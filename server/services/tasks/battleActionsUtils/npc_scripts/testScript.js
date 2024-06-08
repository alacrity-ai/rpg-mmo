const NpcScript = require('./NpcScript');

class TestScript extends NpcScript {
    constructor(battleActionProcessor, battlerInstance, battlerInstances, battleInstanceId) {
        super(battleActionProcessor, battlerInstance, battlerInstances, battleInstanceId);
    }

    async phase0() {
        const actionResult = await this.actionMove(1, 0);
        await this.updatePhase(1);
        return actionResult;
    }

    async phase1() {
        const actionResult = await this.actionMove(-1, 0);
        await this.updatePhase(0);
        return actionResult;
    }
}

module.exports = TestScript;
