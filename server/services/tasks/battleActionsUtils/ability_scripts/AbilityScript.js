const { getAbilityTemplateByShortName } = require('../../../../db/queries/abilityTemplatesQueries');
const BattleActionProcessor = require('../../BattleActionProcessor');

class AbilityScript {
    constructor(abilityShortName, battlerInstance, battlerInstances, battleInstanceId) {
        this.abilityShortName = abilityShortName;
        this.battlerInstance = battlerInstance;
        this.battlerInstances = battlerInstances;
        this.battleInstanceId = battleInstanceId;
        this.abilityTemplate = null;
    }

    async initialize() {
        this.abilityTemplate = await getAbilityTemplateByShortName(this.abilityShortName);
        if (!this.abilityTemplate) {
            throw new Error(`Ability template not found for: ${this.abilityShortName}`);
        }
    }

    async useAbility(targetBattlerInstances, effects) {
        const results = [];
        for (let targetBattlerInstance of targetBattlerInstances) {
            const actionData = {
                abilityId: this.abilityTemplate.id,
                casterId: this.battlerInstance.id,
                targetId: targetBattlerInstance.id,
                ...effects,
                battleInstanceId: this.battleInstanceId
            };

            const action = {
                battleInstanceId: this.battleInstanceId,
                battlerId: this.battlerInstance.id,
                actionType: 'ability',
                actionData
            };

            results.push(await BattleActionProcessor.processSingleAction(action));
        }
        return results;
    }

    calculateDamage(stat, potency) {
        const statValue = this.battlerInstance.stats[stat] || 10; // Assuming a default value if the stat is not defined
        return potency * statValue;
    }

    getTargetsByGridPositions(gridPositions) {
        return this.battlerInstances.filter(battlerInstance => {
            return gridPositions.some(position => 
                position[0] === battlerInstance.gridPosition[0] && 
                position[1] === battlerInstance.gridPosition[1]
            );
        });
    }
}

module.exports = AbilityScript;
