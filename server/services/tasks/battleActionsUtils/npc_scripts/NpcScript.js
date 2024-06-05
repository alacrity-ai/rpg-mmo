const { updateBattlerPhase } = require('../../../../db/queries/battlerInstancesQueries');
const BattleActionProcessor = require('../BattleActionProcessor');

class NpcScript {
    constructor(battlerInstance, battlerInstances, battleInstanceId) {
        this.battlerInstance = battlerInstance;
        this.battlerInstances = battlerInstances;
        this.battleInstanceId = battleInstanceId;
        this.battlerInstanceId = battlerInstance.id;
        this.phase = battlerInstance.phase;
        this.gridPosition = battlerInstance.gridPosition;
        this.team = battlerInstance.team;
    }

    async execute() {
        const phaseMethod = `phase${this.phase}`;
        if (this[phaseMethod]) {
            const actionData = await this[phaseMethod]();
            return actionData;
        } else {
            throw new Error(`Phase method ${phaseMethod} not implemented.`);
        }
    }

    async updatePhase(newPhase) {
        // Logic to update the battler's phase in the database
        await updateBattlerPhase(this.battlerInstanceId, newPhase);
    }

    async actionMove(x, y) {
        const newPosition = [this.gridPosition[0] + x, this.gridPosition[1] + y];
        const actionData = {
            newPosition,
            currentPosition: this.gridPosition,
            team: this.team
        };
        const action = {
            battleInstanceId: this.battleInstanceId,
            battlerId: this.battlerInstanceId,
            actionType: 'move',
            actionData
        };
        const result = await BattleActionProcessor.processSingleAction(action);
        return result;
    }
}

module.exports = NpcScript;
