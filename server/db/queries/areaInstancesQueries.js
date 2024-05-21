const { query } = require('../database');

async function getAreaInstanceById(id) {
  const sql = 'SELECT * FROM area_instances WHERE id = ?';
  const params = [id];
  const rows = await query(sql, params);
  return rows[0];
}

async function getAllAreaInstances() {
  const sql = 'SELECT * FROM area_instances';
  const rows = await query(sql);
  return rows;
}

async function getHostileNPCsByAreaInstanceId(id) {
  const sql = 'SELECT hostile_npcs FROM area_instances WHERE id = ?';
  const params = [id];
  const rows = await query(sql, params);
  return JSON.parse(rows[0].hostile_npcs);
}

async function getFriendlyNPCsByAreaInstanceId(id) {
  const sql = 'SELECT friendly_npcs FROM area_instances WHERE id = ?';
  const params = [id];
  const rows = await query(sql, params);
  return JSON.parse(rows[0].friendly_npcs);
}

module.exports = { getAreaInstanceById, getAllAreaInstances, getHostileNPCsByAreaInstanceId, getFriendlyNPCsByAreaInstanceId };
