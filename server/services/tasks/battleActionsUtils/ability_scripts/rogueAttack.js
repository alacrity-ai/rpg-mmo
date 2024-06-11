const AbilityScript = require('./AbilityScript');

class RogueAttack extends AbilityScript {
    constructor(battlerInstance, battlerInstances, battleInstanceId) {
        super('rogueAttack', battlerInstance, battlerInstances, battleInstanceId);
    }

    async execute() {
        await this.initialize();

        const damage = this.calculateDamage('strength', this.abilityTemplate.potency);
        const manaGain = damage
        return this.processEffects(damage, null, null, null, manaGain);
    }
}

module.exports = RogueAttack;
