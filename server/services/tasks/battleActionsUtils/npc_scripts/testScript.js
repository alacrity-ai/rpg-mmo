const NpcScript = require('./NpcScript');

class TestScript extends NpcScript {
    constructor(battlerInstance, battlerInstances, battleInstanceId) {
        super(battlerInstance, battlerInstances, battleInstanceId);
    }

    async phase0() {
        const actionResult = await this.actionMove(1, 0);
        await this.updatePhase(1);
        console.log('TESTSCRIPT: phase0 actionResult:', actionResult);
        return actionResult;
    }

    async phase1() {
        const actionResult = await this.actionMove(-1, 0);
        await this.updatePhase(0);
        console.log('TESTSCRIPT: phase0 actionResult:', actionResult);
        return actionResult;
    }
}

module.exports = TestScript;
