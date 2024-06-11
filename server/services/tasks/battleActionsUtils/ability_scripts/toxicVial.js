const AbilityScript = require('./AbilityScript');

class RogueAttack extends AbilityScript {
    constructor(battlerInstance, battlerInstances, battleInstanceId) {
        super('toxicVial', battlerInstance, battlerInstances, battleInstanceId);
    }

    async execute() {
        await this.initialize();

        const damage = this.calculateDamage('strength', this.abilityTemplate.potency);

        return this.processEffects(damage);
    }
}

module.exports = RogueAttack;
