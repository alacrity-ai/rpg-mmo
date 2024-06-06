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
        // Move left a tile
        const actionResult = await this.actionMove(-1, 0);
        this.updatePhase(0);
        return actionResult;
    }
}

module.exports = TestScript;
