// utilities/testBattleCreator.js

const BattleCreator = require('../services/expeditions/battleCreator');
const BattleManager = require('../services/expeditions/battleManager');
const { getBattleInstanceById } = require('../db/queries/battleInstancesQueries');

async function testBattleCreator() {
    const characterId = 3;
    const encounterTemplateId = 3;
    const areaInstanceId = 1; // Set the area instance ID here

    const battleCreator = new BattleCreator(characterId, encounterTemplateId, areaInstanceId);

    try {
        const result = await battleCreator.execute();
        console.log('Battle created successfully!');
        console.log('Battle Instance:', result.battleInstance);
        console.log('Battler Instances:', result.battlerInstances);

        const battleId = result.battleInstance.id;
        const battleManager = new BattleManager();

        // Check the battle state
        const winner = await battleManager.getWinner(battleId);
        console.log('Battle State (should be ongoing):', winner);

        // Add a new character to the battle
        const newCharacterId = 4;
        const newBattlerInstance = await battleManager.addCharacterToBattle(battleId, newCharacterId);
        // Verify that newBattlerInstance.id is in the battleInstance.battlerIds array
        const updatedBattleInstance = await getBattleInstanceById(battleId);
        console.log('Updated Battle Instance:', updatedBattleInstance);
        if (!updatedBattleInstance.battlerIds.includes(newBattlerInstance.id)) {
            throw new Error(`Character with ID ${newCharacterId} not added to battle`);
        }
        console.log(`Character ${newCharacterId} joined the battle`);

        // Complete the battle
        await battleManager.completeBattle(battleId);
        console.log(`Battle with ID ${battleId} completed and cleaned up`);

    } catch (error) {
        console.error('Error during battle creation or management:', error);
    }
}

testBattleCreator();
