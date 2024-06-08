const { updateBattlerPhase } = require('../../../../db/queries/battlerInstancesQueries');
const { actionMove, actionMoveToEnemy, actionMoveFromEnemy, actionMoveToDestination, actionMoveToBattler } = require('./npc_actions/moveActions');

class NpcScript {
    constructor(battleActionProcessor, battlerInstance, battlerInstances, battleInstanceId) {
        this.battleActionProcessor = battleActionProcessor;
        this.battlerInstance = battlerInstance;
        this.battlerInstances = battlerInstances;
        this.battleInstanceId = battleInstanceId;
        this.battlerInstanceId = battlerInstance.id;
        this.phase = battlerInstance.phase;
        this.gridPosition = battlerInstance.gridPosition;
        this.team = battlerInstance.team;
    }

    async execute() {
        const totalPhases = this.getTotalPhases();
        let attempts = 0;

        while (attempts < totalPhases) {
            const phaseMethod = `phase${this.phase}`;
            if (this[phaseMethod]) {
                const actionResult = await this[phaseMethod]();
                if (!this.actionFailed(actionResult)) {
                    return actionResult;
                } 
            } else {
                return { success: false, message: `Phase method ${phaseMethod} not implemented.` };
            }

            this.phase = (this.phase + 1) % totalPhases;
            await this.updatePhase(this.phase);
            attempts += 1;
        }
        return { success: false, message: 'All phases failed, potential infinite loop detected' };
    }

    async updatePhase(newPhase) {
        this.phase = newPhase;
        await updateBattlerPhase(this.battlerInstanceId, newPhase);
    }

    async actionMove(x, y) {
        return await actionMove(this, x, y);
    }

    async actionMoveToEnemy() {
        return await actionMoveToEnemy(this, this.battlerInstances);
    }

    async actionMoveFromEnemy() {
        return await actionMoveFromEnemy(this, this.battlerInstances);
    }

    async moveToDestination(x, y) {
        return await moveToDestination(this, x, y);
    }

    async moveToBattler(targetBattlerInstance) {
        return await moveToBattler(this, targetBattlerInstance);
    }

    actionFailed(result) {
        return !result.success;
    }

    getTotalPhases() {
        const phaseMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(this))
            .filter(prop => prop.startsWith('phase') && typeof this[prop] === 'function');
        return phaseMethods.length;
    }
}

module.exports = NpcScript;
