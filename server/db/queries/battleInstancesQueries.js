const { query } = require('../database');
const BattlerInstance = require('../../models/BattlerInstance');
const { getCharacterById } = require('./characterQueries');
const { getNPCTemplateById } = require('./npcTemplatesQueries');

async function createBattlerInstance(battlerInstance) {
    const sql = `
        INSERT INTO battler_instances (
            character_id, npc_template_id, base_stats, current_stats, abilities, script_path,
            sprite_path, grid_position, last_action_time, time_created, status_effects, team
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
        battlerInstance.characterId,
        battlerInstance.npcTemplateId,
        JSON.stringify(battlerInstance.baseStats),
        JSON.stringify(battlerInstance.currentStats),
        JSON.stringify(battlerInstance.abilities),
        battlerInstance.scriptPath,
        battlerInstance.spritePath, // Include sprite path
        JSON.stringify(battlerInstance.gridPosition),
        battlerInstance.lastActionTime,
        battlerInstance.timeCreated,
        JSON.stringify(battlerInstance.statusEffects),
        battlerInstance.team
    ];
    const result = await query(sql, params);
    return result.insertId;
}

async function getBattlerInstanceById(id) {
    const sql = 'SELECT * FROM battler_instances WHERE id = ?';
    const params = [id];
    const rows = await query(sql, params);
    if (rows.length > 0) {
        const battlerInstance = rows[0];
        return new BattlerInstance(battlerInstance);
    }
    return null;
}

async function updateBattlerInstance(id, updates) {
    const sql = `
        UPDATE battler_instances
        SET
            base_stats = ?,
            current_stats = ?,
            abilities = ?,
            script_path = ?,
            sprite_path = ?,
            grid_position = ?,
            last_action_time = ?,
            status_effects = ?,
            team = ?
        WHERE id = ?
    `;
    const params = [
        JSON.stringify(updates.baseStats),
        JSON.stringify(updates.currentStats),
        JSON.stringify(updates.abilities),
        updates.scriptPath,
        updates.spritePath,  // Add sprite path
        JSON.stringify(updates.gridPosition),
        updates.lastActionTime,
        JSON.stringify(updates.statusEffects),
        updates.team,
        id
    ];
    await query(sql, params);
}

async function updateBattlerPositions(battlerPositions) {
    const updates = battlerPositions.map(bp => `(${bp.battlerId}, '${JSON.stringify(bp.newPosition)}')`).join(',');
    const sql = `
        INSERT INTO battler_instances (id, grid_position)
        VALUES ${updates}
        ON DUPLICATE KEY UPDATE grid_position = VALUES(grid_position)
    `;
    await query(sql);
}

async function deleteBattlerInstance(id) {
    const sql = 'DELETE FROM battler_instances WHERE id = ?';
    const params = [id];
    await query(sql, params);
}

async function instanceCanAct(id) {
    const sql = 'SELECT last_action_time FROM battler_instances WHERE id = ?';
    const params = [id];
    const rows = await query(sql, params);
    if (rows.length > 0) {
        const lastActionTime = new Date(rows[0].last_action_time);
        const now = new Date();
        const differenceInSeconds = (now - lastActionTime) / 1000;
        return differenceInSeconds > 3;
    }
    return false;
}

async function createBattlerInstancesFromCharacterIds(characterIds) {
    const battlerInstanceIds = [];
    for (const characterId of characterIds) {
        const character = await getCharacterById(characterId);
        if (character) {
            const battlerInstance = new BattlerInstance({
                character_id: character.id,
                npc_template_id: null,
                base_stats: character.baseStats,
                current_stats: character.currentStats,
                abilities: [], // Add abilities if applicable
                script_path: null,
                sprite_path: `assets/images/characters/${character.characterClass}/combat/atlas.png`,
                grid_position: [1, 1], // Set initial grid position if applicable
                last_action_time: new Date(),
                time_created: new Date(),
                status_effects: [],
                team: 'player'
            });
            const battlerInstanceId = await createBattlerInstance(battlerInstance);
            battlerInstanceIds.push(battlerInstanceId);
        }
    }
    return battlerInstanceIds;
}

async function createBattlerInstancesFromNPCTemplateIds(npcTemplateIds) {
    const battlerInstanceIds = [];
    for (const npcTemplateId of npcTemplateIds) {
        const npcTemplate = await getNPCTemplateById(npcTemplateId);
        if (npcTemplate) {
            const battlerInstance = new BattlerInstance({
                character_id: null,
                npc_template_id: npcTemplate.id,
                base_stats: npcTemplate.baseStats,
                current_stats: npcTemplate.baseStats, // NPCs start with base stats as current stats
                abilities: [], // Add abilities if applicable
                script_path: npcTemplate.scriptPath,
                sprite_path: npcTemplate.battlerSpritePath, // Use NPC's battler sprite path
                grid_position: [1, 1], // Set initial grid position if applicable
                last_action_time: new Date(),
                time_created: new Date(),
                status_effects: [],
                team: 'enemy'
            });
            const battlerInstanceId = await createBattlerInstance(battlerInstance);
            battlerInstanceIds.push(battlerInstanceId);
        }
    }
    return battlerInstanceIds;
}

module.exports = {
    createBattlerInstance,
    getBattlerInstanceById,
    updateBattlerInstance,
    updateBattlerPositions,
    deleteBattlerInstance,
    instanceCanAct,
    createBattlerInstancesFromCharacterIds,
    createBattlerInstancesFromNPCTemplateIds
};
