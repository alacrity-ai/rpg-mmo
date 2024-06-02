const { getEncounterTemplateById } = require('../../db/queries/encounterTemplatesQueries');
const { getNPCTemplateById } = require('../../db/queries/npcTemplatesQueries');
const { createBattlerInstancesFromCharacterIds, createBattlerInstancesFromNPCTemplateIds } = require('../../db/queries/battlerInstancesQueries');
const { createBattleInstance } = require('../../db/queries/battleInstancesQueries');

class BattleCreator {
    constructor(characterId, encounterTemplateId, areaInstanceId) {
        this.characterId = characterId;
        this.encounterTemplateId = encounterTemplateId;
        this.areaInstanceId = areaInstanceId; // Assign the areaInstanceId here
        this.battleInstance = null;
        this.battlerInstances = [];
    }

    async initialize() {
        await this.loadEncounterTemplate();
        await this.loadNpcTemplates();
    }

    async loadEncounterTemplate() {
        this.encounterTemplate = await getEncounterTemplateById(this.encounterTemplateId);
        if (!this.encounterTemplate) {
            throw new Error(`Encounter template with ID ${this.encounterTemplateId} not found.`);
        }
    }

    async loadNpcTemplates() {
        this.npcTemplates = [];
        for (const enemy of this.encounterTemplate.enemies) {
            const npcTemplate = await getNPCTemplateById(enemy.npc_template_id);
            if (!npcTemplate) {
                throw new Error(`NPC template with ID ${enemy.npc_template_id} not found.`);
            }
            this.npcTemplates.push(npcTemplate);
        }
    }

    async createBattle() {
        const playerBattlerInstances = await createBattlerInstancesFromCharacterIds([this.characterId]);
        const enemyBattlerInstances = await createBattlerInstancesFromNPCTemplateIds(this.npcTemplates.map(npc => npc.id));
        this.battlerInstances = [...playerBattlerInstances, ...enemyBattlerInstances];
    
        const battleInstanceData = {
            battler_ids: this.battlerInstances.map(battler => battler.id),
            area_instance_id: this.areaInstanceId
        };
        this.battleInstance = await createBattleInstance(battleInstanceData);
    }
    
    async execute() {
        await this.initialize();
        await this.createBattle();
        return {
            battleInstance: this.battleInstance,
            battlerInstances: this.battlerInstances,
        };
    }
}

module.exports = BattleCreator;