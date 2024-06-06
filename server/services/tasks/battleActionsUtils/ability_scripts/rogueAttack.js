const AbilityScript = require('./AbilityScript');

class RogueAttack extends AbilityScript {
    constructor(battlerInstance, battlerInstances, battleInstanceId) {
        super('rogue_attack', battlerInstance, battlerInstances, battleInstanceId);
    }

    async execute(gridPositions) {
        await this.initialize();

        const damage = this.calculateDamage('strength', this.abilityTemplate.potency);
        const targetBattlerInstances = this.getTargetsByGridPositions(gridPositions);
        const actionResults = await this.useAbility(targetBattlerInstances, {
            damage,
            statusEffects: ['poison'] // Example of applying a poison status effect
        });

        return actionResults;
    }
}

module.exports = RogueAttack;
