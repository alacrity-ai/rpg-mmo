const { query } = require('../database');
const Character = require('../../models/Character');
const { getClassTemplateByName } = require('./classTemplatesQueries');
const { classStartingAbilitiesMap } = require('../data/characterStartingAbilities');

async function createCharacter(userId, characterName, characterClass) {
  const lowerCaseCharacterName = characterName.toLowerCase();
  const lowerCaseCharacterClass = characterClass.toLowerCase();

  if (!/^[a-zA-Z]{2,}$/.test(lowerCaseCharacterName)) {
    throw new Error('Character name must be at least 2 letters long and contain only letters.');
  }

  const existingCharacter = await getCharacter(userId, lowerCaseCharacterName);
  if (existingCharacter) {
    throw new Error(`Character with name ${lowerCaseCharacterName} already exists for user ID: ${userId}`);
  }

  const classTemplate = await getClassTemplateByName(lowerCaseCharacterClass);
  if (!classTemplate) {
    throw new Error(`Class template not found for class: ${lowerCaseCharacterClass}`);
  }

  const abilities = classStartingAbilitiesMap[lowerCaseCharacterClass];
  if (!abilities) {
    throw new Error(`Abilities not found for class: ${lowerCaseCharacterClass}`);
  }

  const baseStats = JSON.stringify(classTemplate.baseStats);

  const sql = 'INSERT INTO characters (user_id, name, class, base_stats, current_stats, abilities, flags) VALUES (?, ?, ?, ?, ?, ?, ?)';
  const params = [userId, lowerCaseCharacterName, lowerCaseCharacterClass, baseStats, baseStats, JSON.stringify(abilities), JSON.stringify({})];
  const result = await query(sql, params);
  return result.insertId;
}

async function getCharacterById(id) {
  const sql = 'SELECT * FROM characters WHERE id = ?';
  const params = [id];
  const rows = await query(sql, params);
  if (rows.length > 0) {
    return new Character({
      id: rows[0].id,
      user_id: rows[0].user_id,
      name: rows[0].name,
      characterClass: rows[0].class,
      baseStats: rows[0].base_stats,
      currentStats: rows[0].current_stats,
      abilities: rows[0].abilities,
      current_area_id: rows[0].current_area_id,
      previous_area_id: rows[0].previous_area_id,
      current_town_key: rows[0].current_town_key,
      flags: rows[0].flags
    });
  }
  return null;
}

async function getCharacterByName(name) {
  const sql = 'SELECT * FROM characters WHERE name = ?';
  const params = [name];
  const rows = await query(sql, params);
  if (rows.length > 0) {
    return new Character({
      id: rows[0].id,
      user_id: rows[0].user_id,
      name: rows[0].name,
      characterClass: rows[0].class,
      baseStats: rows[0].base_stats,
      currentStats: rows[0].current_stats,
      abilities: rows[0].abilities,
      current_area_id: rows[0].current_area_id,
      previous_area_id: rows[0].previous_area_id,
      current_town_key: rows[0].current_town_key,
      flags: rows[0].flags
    });
  }
  return null;
}

async function getCharacter(userId, characterName) {
  const lowerCaseCharacterName = characterName.toLowerCase();
  const sql = 'SELECT * FROM characters WHERE user_id = ? AND name = ?';
  const params = [userId, lowerCaseCharacterName];
  const rows = await query(sql, params);
  if (rows.length > 0) {
    return new Character({
      id: rows[0].id,
      user_id: rows[0].user_id,
      name: rows[0].name,
      characterClass: rows[0].class,
      baseStats: rows[0].base_stats,
      currentStats: rows[0].current_stats,
      abilities: rows[0].abilities,
      current_area_id: rows[0].current_area_id,
      previous_area_id: rows[0].previous_area_id,
      current_town_key: rows[0].current_town_key,
      flags: rows[0].flags
    });
  }
  return null;
}

async function getCharactersByUser(userId) {
  const sql = 'SELECT * FROM characters WHERE user_id = ?';
  const params = [userId];
  const rows = await query(sql, params);
  return rows.map(row => {
    try {
      return new Character({
        id: row.id,
        user_id: row.user_id,
        name: row.name,
        characterClass: row.class,
        baseStats: row.base_stats,
        currentStats: row.current_stats,
        abilities: row.abilities,
        current_area_id: row.current_area_id,
        previous_area_id: row.previous_area_id,
        current_town_key: row.current_town_key,
        flags: row.flags
      });
    } catch (err) {
      console.error('Error parsing character stats:', err.message, 'Base stats:', row.base_stats, 'Current stats:', row.current_stats);
      throw err;
    }
  });
}

async function getCharacterStats(characterId) {
  const sql = 'SELECT base_stats, current_stats FROM characters WHERE id = ?';
  const params = [characterId];
  const rows = await query(sql, params);
  if (rows.length > 0) {
    return {
      baseStats: rows[0].base_stats,
      currentStats: rows[0].current_stats
    };
  }
  return null;
}

async function getCharacterArea(characterId) {
  const sql = 'SELECT current_area_id FROM characters WHERE id = ?';
  const params = [characterId];
  const rows = await query(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

async function updateCharacterStats(characterId, currentStats) {
  const sql = 'UPDATE characters SET current_stats = ? WHERE id = ?';
  const params = [JSON.stringify(currentStats), characterId];
  await query(sql, params);
}

async function getCharactersByIds(characterIds) {
  const idsString = characterIds.join(',');
  const sql = `SELECT * FROM characters WHERE id IN (${idsString})`;
  const rows = await query(sql);
  return rows.map(row => new Character({
    id: row.id,
    user_id: row.user_id,
    name: row.name,
    characterClass: row.class,
    baseStats: row.base_stats,
    currentStats: row.current_stats,
    abilities: row.abilities,
    current_area_id: row.current_area_id,
    previous_area_id: row.previous_area_id,
    current_town_key: row.current_town_key,
    flags: row.flags
  }));
}

async function updateCharacterFlags(characterId, flags) {
  const sql = 'UPDATE characters SET flags = ? WHERE id = ?';
  const params = [JSON.stringify(flags), characterId];
  await query(sql, params);
}

async function updateCharacterFlag(characterId, flag, value) {
  const character = await getCharacterById(characterId);
  if (!character) throw new Error(`Character with ID ${characterId} not found`);

  const flags = character.flags ? character.flags : {};
  flags[flag] = value;
  await updateCharacterFlags(characterId, flags);
}

async function addCharacterFlag(characterId, flag, value) {
  const character = await getCharacterById(characterId);
  if (!character) throw new Error(`Character with ID ${characterId} not found`);

  const flags = character.flags ? character.flags : {};
  flags[flag] = value;
  await updateCharacterFlags(characterId, flags);
}

async function removeCharacterFlag(characterId, flag) {
  const character = await getCharacterById(characterId);
  if (!character) throw new Error(`Character with ID ${characterId} not found`);

  const flags = character.flags ? character.flags : {};
  delete flags[flag];
  await updateCharacterFlags(characterId, flags);
}

async function getCharacterFlags(characterId) {
  const sql = 'SELECT flags FROM characters WHERE id = ?';
  const params = [characterId];
  const rows = await query(sql, params);
  return rows.length > 0 ? rows[0].flags || {} : {};
}

module.exports = { 
  getCharacterByName,
  getCharacterById,
  createCharacter, 
  getCharacter, 
  getCharactersByUser, 
  getCharacterStats, 
  getCharacterArea, 
  updateCharacterStats,
  getCharactersByIds,
  addCharacterFlag,
  removeCharacterFlag,
  updateCharacterFlag,
  getCharacterFlags
};
