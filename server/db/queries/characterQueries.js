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
  return rows[0];
}

async function getCharactersByUser(userId) {
  const sql = 'SELECT * FROM characters WHERE user_id = ?';
  const params = [userId];
  const rows = await query(sql, params);
  return rows;
}

async function updateCharacterStats(characterId, currentStats) {
  const sql = 'UPDATE characters SET current_stats = ? WHERE character_id = ?';
  const params = [currentStats, characterId];
  await query(sql, params);
}

module.exports = { createCharacter, getCharacter, getCharactersByUser, updateCharacterStats };
