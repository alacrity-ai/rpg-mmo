const { query } = require('../database');
const Character = require('../../models/Character');
const { getClassTemplateByName } = require('./classTemplatesQueries');

async function createCharacter(userId, characterName, characterClass) {
  // Get base stats from the class template
  const classTemplate = await getClassTemplateByName(characterClass);
  if (!classTemplate) {
    throw new Error(`Class template not found for class: ${characterClass}`);
  }
  
  const baseStats = JSON.stringify(classTemplate.baseStats);

  const sql = 'INSERT INTO characters (user_id, name, class, base_stats, current_stats) VALUES (?, ?, ?, ?, ?)';
  const params = [userId, characterName, characterClass, baseStats, baseStats];
  const result = await query(sql, params);
  return result.insertId;
}

async function getCharacter(userId, characterName) {
  const sql = 'SELECT * FROM characters WHERE user_id = ? AND name = ?';
  const params = [userId, characterName];
  const rows = await query(sql, params);
  if (rows.length > 0) {
    return new Character({
      id: rows[0].id,
      user_id: rows[0].user_id,
      name: rows[0].name,
      characterClass: rows[0].class,
      baseStats: JSON.parse(rows[0].base_stats),
      currentStats: JSON.parse(rows[0].current_stats),
      current_area_id: rows[0].current_area_id,
      socket_id: rows[0].socket_id,
    });
  }
  return null;
}

async function getCharactersByUser(userId) {
  const sql = 'SELECT * FROM characters WHERE user_id = ?';
  const params = [userId];
  const rows = await query(sql, params);
  return rows.map(row => {
    console.log('Row retrieved:', row);
    try {
      return new Character({
        id: row.id,
        user_id: row.user_id,
        name: row.name,
        characterClass: row.class,
        baseStats: row.baseStats,
        currentStats: row.currentStats,
        current_area_id: row.current_area_id,
        socket_id: row.socket_id,
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
      baseStats: JSON.parse(rows[0].base_stats),
      currentStats: JSON.parse(rows[0].current_stats),
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

module.exports = { 
  createCharacter, 
  getCharacter, 
  getCharactersByUser, 
  getCharacterStats, 
  getCharacterArea,
  updateCharacterStats 
};
