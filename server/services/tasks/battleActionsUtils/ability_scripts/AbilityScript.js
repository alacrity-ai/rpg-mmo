const { getAbilityTemplateByShortName } = require('../../../../db/queries/abilityTemplatesQueries');

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

    calculateDamage(stat, potency) {
        const battlerLevel = this.battlerInstance.level;
        const statValue = this.battlerInstance.currentStats[stat];
        const damage = potency * (statValue * 0.1) * (battlerLevel / (battlerLevel + 10));
        return Math.round(damage);
    }

    getTargetsByGridPositions(gridPositions) {
        return this.battlerInstances.filter(battlerInstance => {
            return gridPositions.some(position => 
                position[0] === battlerInstance.gridPosition[0] && 
                position[1] === battlerInstance.gridPosition[1]
            );
        });
    }

    execute() {
        throw new Error('execute method must be implemented by the subclass');
    }
}

module.exports = AbilityScript;
