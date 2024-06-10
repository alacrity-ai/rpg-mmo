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

    execute() {
        throw new Error('execute method must be implemented by the subclass');
    }
}

module.exports = AbilityScript;
