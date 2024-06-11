const AbilityScript = require('./AbilityScript');

class RogueAttack extends AbilityScript {
    constructor(battlerInstance, battlerInstances, battleInstanceId) {
        super('toxicVial', battlerInstance, battlerInstances, battleInstanceId);
    }

    async execute() {
        await this.initialize();

        const damage = this.calculateDamage('strength', this.abilityTemplate.potency);

        // Acceptable any number of these keys in return object: damage, healing, status
        return { damage: damage, healing: null, status: null };
    }
}

module.exports = RogueAttack;
