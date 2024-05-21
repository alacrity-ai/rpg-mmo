const { query } = require('../database');

async function createCharacter(userId, characterName, characterClass) {
  const sql = 'INSERT INTO characters (user_id, name, class, base_stats, current_stats) VALUES (?, ?, ?, ?, ?)';
  const params = [userId, characterName, characterClass, '{}', '{}'];
  const result = await query(sql, params);
  return result.insertId;
}

async function getCharacter(userId, characterName) {
  const sql = 'SELECT * FROM characters WHERE user_id = ? AND name = ?';
  const params = [userId, characterName];
  const rows = await query(sql, params);
  if (rows.length > 0) {
    const character = rows[0];
    character.base_stats = JSON.parse(character.base_stats);
    character.current_stats = JSON.parse(character.current_stats);
    return character;
  }
  return null;
}

async function getCharactersByUser(userId) {
  const sql = 'SELECT * FROM characters WHERE user_id = ?';
  const params = [userId];
  const rows = await query(sql, params);
  return rows.map(row => ({
    ...row,
    base_stats: JSON.parse(row.base_stats),
    current_stats: JSON.parse(row.current_stats)
  }));
}

async function getCharacterStats(characterId) {
  const sql = 'SELECT base_stats, current_stats FROM characters WHERE id = ?';
  const params = [characterId];
  const rows = await query(sql, params);
  if (rows.length > 0) {
    const stats = rows[0];
    stats.base_stats = JSON.parse(stats.base_stats);
    stats.current_stats = JSON.parse(stats.current_stats);
    return stats;
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
