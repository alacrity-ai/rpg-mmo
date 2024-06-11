const AbilityScript = require('./AbilityScript');

class RogueAttack extends AbilityScript {
    constructor(battlerInstance, battlerInstances, battleInstanceId) {
        super('bandage', battlerInstance, battlerInstances, battleInstanceId);
    }

    async execute() {
        await this.initialize();

        const healing = this.calculateDamage('intelligence', this.abilityTemplate.potency);

        return this.processEffects(null, healing);
    }
}

module.exports = RogueAttack;
