// services/expeditions/battleHelpers.js

const { getEncounterTemplateById } = require('../../db/queries/encounterTemplatesQueries');
const { getNPCTemplateById } = require('../../db/queries/npcTemplatesQueries');
const { createBattlerInstancesFromCharacterIds, createBattlerInstancesFromNPCTemplateIds, updateBattlerPositions } = require('../../db/queries/battlerInstancesQueries');
const { createBattleInstance, getBattlerInstancesInBattle } = require('../../db/queries/battleInstancesQueries');
const { getBattleInstanceByAreaInstanceId } = require('../../db/queries/battleInstancesQueries');
const BattleManager = require('./battleManager');

class BattleCreator {
    constructor(characterId, encounterTemplateId, areaInstanceId) {
        this.characterId = characterId;
        this.encounterTemplateId = encounterTemplateId;
        this.areaInstanceId = areaInstanceId;
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

        // Assign enemy positions based on the encounter template
        await this.assignEnemyPositions(enemyBattlerInstances);

        const battleInstanceData = {
            battler_ids: this.battlerInstances.map(battler => battler.id),
            area_instance_id: this.areaInstanceId
        };
        this.battleInstance = await createBattleInstance(battleInstanceData);
    }

    async assignEnemyPositions(enemyBattlerInstances) {
        const enemyPositions = this.encounterTemplate.enemies;
        const battlerPositions = [];

        enemyPositions.forEach((enemy, index) => {
            const battler = enemyBattlerInstances[index];
            if (battler) {
                battler.gridPosition = enemy.position;
                battlerPositions.push({ id: battler.id, position: enemy.position });
            }
        });

        await updateBattlerPositions(battlerPositions);
    }

    async execute() {
        const existingBattleInstance = await getBattleInstanceByAreaInstanceId(this.areaInstanceId);
        if (existingBattleInstance) {
            const battleManager = new BattleManager();
            const newBattlerInstance = await battleManager.addCharacterToBattle(existingBattleInstance.id, this.characterId);
            this.battleInstance = existingBattleInstance;
            this.battlerInstances = await getBattlerInstancesInBattle(existingBattleInstance.id);
        } else {
            await this.initialize();
            await this.createBattle();
        }
        
        return {
            battleInstance: this.battleInstance,
            battlerInstances: this.battlerInstances,
        };
    }
}

module.exports = BattleCreator;
