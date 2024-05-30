const { query } = require('../database');
const BattleInstance = require('../../models/BattleInstance');
const BattlerInstance = require('../../models/BattlerInstance');
const { createBattlerInstancesFromCharacterIds } = require('./battlerInstancesQueries');
const { createBattlerInstancesFromNPCTemplateIds } = require('./battlerInstancesQueries');

async function createBattleInstance(battlerIds) {
    const sql = `
        INSERT INTO battle_instances (battler_ids, time_created)
        VALUES (?, ?)
    `;
    const params = [
        JSON.stringify(battlerIds),
        new Date()
    ];
    const result = await query(sql, params);
    return result.insertId;
}

async function getBattleInstanceById(id) {
    const sql = 'SELECT * FROM battle_instances WHERE id = ?';
    const params = [id];
    const rows = await query(sql, params);
    if (rows.length > 0) {
        const battleInstance = rows[0];
        return new BattleInstance(battleInstance);
    }
    return null;
}

async function getAllBattleInstances() {
    const sql = 'SELECT * FROM battle_instances';
    const rows = await query(sql);
    return rows.map(row => new BattleInstance(row));
}

async function deleteBattleInstance(id) {
    const sql = 'DELETE FROM battle_instances WHERE id = ?';
    const params = [id];
    await query(sql, params);
}

async function getBattlersInBattle(battleId) {
    const sql = 'SELECT battler_ids FROM battle_instances WHERE id = ?';
    const params = [battleId];
    const rows = await query(sql, params);
    if (rows.length > 0) {
        const battlerIds = rows[0].battler_ids;
        const battlersSql = 'SELECT * FROM battler_instances WHERE id IN (?)';
        const battlersParams = [battlerIds];
        const battlerRows = await query(battlersSql, battlersParams);
        return battlerRows.map(row => new BattlerInstance(row));
    }
    return [];
}

async function createBattleWithCharactersAndNPCs(characterIds, npcTemplateIds) {
    // Create battler instances for characters
    const characterBattlerIds = await createBattlerInstancesFromCharacterIds(characterIds);

    // Create battler instances for NPC templates
    const npcBattlerIds = await createBattlerInstancesFromNPCTemplateIds(npcTemplateIds);

    // Combine all battler IDs
    const allBattlerIds = [...characterBattlerIds, ...npcBattlerIds];

    // Create a new battle instance with all battler IDs
    const battleInstanceId = await createBattleInstance(allBattlerIds);
    return battleInstanceId;
}

module.exports = {
    createBattleInstance,
    getBattleInstanceById,
    getAllBattleInstances,
    deleteBattleInstance,
    getBattlersInBattle,
    createBattleWithCharactersAndNPCs
};
