const AbilityScript = require('./AbilityScript');

class RogueAttack extends AbilityScript {
    constructor(battlerInstance, battlerInstances, battleInstanceId) {
        super('bandage', battlerInstance, battlerInstances, battleInstanceId);
    }

    async execute() {
        await this.initialize();

        const healing = this.calculateDamage('intelligence', this.abilityTemplate.potency);

        // Acceptable any number of these keys in return object: damage, healing, status
        return { damage: null, healing: healing, status: null };
    }
}

module.exports = RogueAttack;
