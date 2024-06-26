const { query } = require('../database');
const BattlerInstance = require('../../models/BattlerInstance');
const Character = require('../../models/Character');
const { getCharacterById } = require('./characterQueries');
const { getNPCTemplateById } = require('./npcTemplatesQueries');

async function createBattlerInstance(battlerInstanceData) {
    const sql = `
        INSERT INTO battler_instances (
            level, character_id, npc_template_id, class, base_stats, current_stats, abilities, script_path, script_speed,
            sprite_path, grid_position, last_action_time, time_created, status_effects, team, phase, alive
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
        battlerInstanceData.level,
        battlerInstanceData.characterId,
        battlerInstanceData.npcTemplateId,
        battlerInstanceData.battlerClass,
        JSON.stringify(battlerInstanceData.baseStats),
        JSON.stringify(battlerInstanceData.currentStats),
        JSON.stringify(battlerInstanceData.abilities),
        battlerInstanceData.scriptPath,
        battlerInstanceData.scriptSpeed,
        battlerInstanceData.spritePath,
        JSON.stringify(battlerInstanceData.gridPosition),
        battlerInstanceData.lastActionTime,
        battlerInstanceData.timeCreated,
        JSON.stringify(battlerInstanceData.statusEffects),
        battlerInstanceData.team,
        battlerInstanceData.phase || 0, // Default phase to 0
        battlerInstanceData.alive || true
    ];
    const result = await query(sql, params);
    const id = result.insertId;

    // Return the newly created BattlerInstance object
    return new BattlerInstance({
        id,
        level: battlerInstanceData.level,
        character_id: battlerInstanceData.characterId,
        npc_template_id: battlerInstanceData.npcTemplateId,
        battlerClass: battlerInstanceData.battlerClass,
        base_stats: battlerInstanceData.baseStats,
        current_stats: battlerInstanceData.currentStats,
        abilities: battlerInstanceData.abilities,
        script_path: battlerInstanceData.scriptPath,
        script_speed: battlerInstanceData.scriptSpeed,
        sprite_path: battlerInstanceData.spritePath,
        grid_position: battlerInstanceData.gridPosition,
        last_action_time: battlerInstanceData.lastActionTime,
        time_created: battlerInstanceData.timeCreated,
        status_effects: battlerInstanceData.statusEffects,
        team: battlerInstanceData.team,
        phase: battlerInstanceData.phase || 0, // Default phase to 0
        alive: true
    });
}

async function getBattlerInstanceById(id) {
    const sql = 'SELECT * FROM battler_instances WHERE id = ?';
    const params = [id];
    const rows = await query(sql, params);
    if (rows.length > 0) {
        const battlerInstance = rows[0];
        return new BattlerInstance({
            ...battlerInstance,
            battlerClass: battlerInstance.class // Ensure this mapping is correct
        });
    }
    return null;
}


async function getBattlerInstancesByIds(ids) {
    if (!ids || ids.length === 0) return [];
    
    const sql = `SELECT * FROM battler_instances WHERE id IN (${ids.map(() => '?').join(', ')})`;
    const rows = await query(sql, ids);

    if (rows.length > 0) {
        return rows.map(row => new BattlerInstance({
            ...row,
            battlerClass: row.class  // Map the 'class' column to 'battlerClass'
        }));
    }

    return [];
}


async function getBattlerInstancesByCharacterId(characterId) {
    const sql = 'SELECT * FROM battler_instances WHERE character_id = ?';
    const params = [characterId];
    const rows = await query(sql, params);
    
    if (rows.length > 0) {
        return rows.map(row => new BattlerInstance({
            ...row,
            battlerClass: row.class  // Map the 'class' column to 'battlerClass'
        }));
    }
    
    return [];
}

// Function to get characters in a battle
async function getCharactersInBattle(battleInstanceId) {
    const sql = 'SELECT character_id FROM battler_instances WHERE id = ?';
    const params = [battleInstanceId];
    const rows = await query(sql, params);
    
    if (rows.length > 0) {
        const characterIds = rows.map(row => row.character_id);
        const characters = [];
        
        for (const id of characterIds) {
            const characterSql = 'SELECT * FROM characters WHERE id = ?';
            const characterRows = await query(characterSql, [id]);
            
            if (characterRows.length > 0) {
                const row = characterRows[0];
                const character = new Character({
                    id: row.id,
                    user_id: row.user_id,
                    name: row.name,
                    characterClass: row.character_class,
                    level: row.level,
                    baseStats: row.base_stats,
                    currentStats: row.current_stats,
                    abilities: row.abilities,
                    current_area_id: row.current_area_id,
                    previous_area_id: row.previous_area_id,
                    current_town_key: row.current_town_key,
                    flags: row.flags
                });
                characters.push(character);
            }
        }
        
        return characters;
    }
    
    return [];
}

async function updateBattlerInstance(id, updates) {
    const sql = `
        UPDATE battler_instances
        SET
            base_stats = ?,
            current_stats = ?,
            abilities = ?,
            script_path = ?,
            script_speed = ?,
            sprite_path = ?,
            grid_position = ?,
            last_action_time = ?,
            status_effects = ?,
            team = ?,
            phase = ?
            alive = ?
        WHERE id = ?
    `;
    const params = [
        JSON.stringify(updates.baseStats),
        JSON.stringify(updates.currentStats),
        JSON.stringify(updates.abilities),
        updates.scriptPath,
        updates.scriptSpeed,
        updates.spritePath,
        JSON.stringify(updates.gridPosition),
        updates.lastActionTime,
        JSON.stringify(updates.statusEffects),
        updates.team,
        updates.phase,
        updates.alive,
        id
    ];
    await query(sql, params);
}

async function updateBattlerPosition(battlerId, newPosition) {
    const sql = 'UPDATE battler_instances SET grid_position = ? WHERE id = ?';
    const params = [JSON.stringify(newPosition), battlerId];
    await query(sql, params);
}

async function updateBattlerHealth(battlerId, newHealth) {
    const sql = 'UPDATE battler_instances SET current_stats = JSON_SET(current_stats, "$.health", ?) WHERE id = ?';
    const params = [newHealth, battlerId];
    await query(sql, params);
}

async function updateBattlerMana(battlerId, newMana) {
    const sql = 'UPDATE battler_instances SET current_stats = JSON_SET(current_stats, "$.mana", ?) WHERE id = ?';
    const params = [newMana, battlerId];
    await query(sql, params);
}

async function updateBattlerAlive(battlerId, alive) {
    const sql = 'UPDATE battler_instances SET alive = ? WHERE id = ?';
    const params = [alive, battlerId];
    await query(sql, params);
}

// applyStatusEffect stub
async function applyStatusEffect(targetId, status) {
    // stub
}

async function updateBattlerPositions(battlerPositions) {
    if (battlerPositions.length === 0) return;

    let sql = 'UPDATE battler_instances SET grid_position = CASE id';
    const ids = [];
    const params = [];

    battlerPositions.forEach(({ id, position }) => {
        sql += ' WHEN ? THEN ?';
        ids.push(id);
        params.push(id, JSON.stringify(position));
    });

    sql += ' END WHERE id IN (' + ids.map(() => '?').join(',') + ')';
    await query(sql, [...params, ...ids]);
}

async function updateBattlerPhase(battlerId, newPhase) {
    const sql = 'UPDATE battler_instances SET phase = ? WHERE id = ?';
    const params = [newPhase, battlerId];
    await query(sql, params);
}

async function deleteBattlerInstance(id) {
    const sql = 'DELETE FROM battler_instances WHERE id = ?';
    const params = [id];
    await query(sql, params);
}

async function deleteBattlerInstancesByIds(ids) {
    if (ids.length === 0) return;
    const placeholders = ids.map(() => '?').join(',');
    const sql = `DELETE FROM battler_instances WHERE id IN (${placeholders})`;
    await query(sql, ids);
}

async function createBattlerInstancesFromCharacterIds(characterIds) {
    const battlerInstances = [];
    for (const characterId of characterIds) {
        const character = await getCharacterById(characterId);
        if (character) {
            const battlerInstance = new BattlerInstance({
                level: character.level,
                character_id: character.id,
                npc_template_id: null,
                battlerClass: character.characterClass,
                base_stats: character.baseStats,
                current_stats: character.currentStats,
                abilities: character.abilities,
                script_path: null,
                script_speed: null,
                sprite_path: `assets/images/characters/${character.characterClass}`,
                grid_position: [1, 1],
                last_action_time: new Date(),
                time_created: new Date(),
                status_effects: [],
                team: 'player',
                phase: 0, // Default phase to 0
                alive: true
            });
            const createdBattlerInstance = await createBattlerInstance(battlerInstance);
            battlerInstances.push(createdBattlerInstance);
        }
    }
    return battlerInstances;
}

async function createBattlerInstancesFromNPCTemplateIds(npcTemplateIds) {
    const battlerInstances = [];
    for (const npcTemplateId of npcTemplateIds) {
        const npcTemplate = await getNPCTemplateById(npcTemplateId);
        if (npcTemplate) {
            const battlerInstance = new BattlerInstance({
                level: 1, // TODO: Add level scaling in instance creation
                character_id: null,
                npc_template_id: npcTemplate.id,
                battlerClass: null,
                base_stats: npcTemplate.baseStats,
                current_stats: npcTemplate.baseStats, // NPCs start with base stats as current stats
                abilities: [], // Add abilities if applicable
                script_path: npcTemplate.scriptPath,
                script_speed: npcTemplate.scriptSpeed,
                sprite_path: npcTemplate.battlerSpritePath, // Use NPC's battler sprite path
                grid_position: [4, 1],
                last_action_time: new Date(),
                time_created: new Date(),
                status_effects: [],
                team: 'enemy',
                phase: 0, // Default phase to 0
                alive: true
            });
            const createdBattlerInstance = await createBattlerInstance(battlerInstance);
            battlerInstances.push(createdBattlerInstance);
        }
    }
    return battlerInstances;
}

module.exports = {
    createBattlerInstance,
    getBattlerInstanceById,
    getBattlerInstancesByIds,
    updateBattlerInstance,
    updateBattlerPhase,
    deleteBattlerInstance,
    deleteBattlerInstancesByIds,
    createBattlerInstancesFromCharacterIds,
    createBattlerInstancesFromNPCTemplateIds,
    updateBattlerPosition,
    updateBattlerPositions,
    updateBattlerHealth,
    updateBattlerMana,
    updateBattlerAlive,
    applyStatusEffect,
    getBattlerInstancesByCharacterId,
    getCharactersInBattle
};
