const { query } = require('../database');
const AreaInstance = require('../../models/AreaInstance');

async function getAreaInstanceById(id) {
  const sql = 'SELECT * FROM area_instances WHERE id = ?';
  const params = [id];
  const rows = await query(sql, params);
  if (rows.length > 0) {
    return new AreaInstance({
      id: rows[0].id,
      background_image: rows[0].background_image,
      hostileNpcs: rows[0].hostile_npcs,
      friendlyNpcs: rows[0].friendly_npcs,
    });
  }
  return null;
}

async function getAllAreaInstances() {
  const sql = 'SELECT * FROM area_instances';
  const rows = await query(sql);
  return rows.map(row => new AreaInstance({
    id: row.id,
    background_image: row.background_image,
    hostileNpcs: row.hostile_npcs,
    friendlyNpcs: row.friendly_npcs,
  }));
}

async function createAreaInstance(params) {
  const sql = 'INSERT INTO area_instances (background_image, hostile_npcs, friendly_npcs) VALUES (?, ?, ?)';
  const hostileNpcs = JSON.stringify(params.hostileNpcs);
  const friendlyNpcs = JSON.stringify(params.friendlyNpcs);
  const result = await query(sql, [params.background_image, hostileNpcs, friendlyNpcs]);
  const areaInstance = new AreaInstance({
    id: result.insertId,
    background_image: params.background_image,
    hostileNpcs: params.hostileNpcs,
    friendlyNpcs: params.friendlyNpcs
  });
  return areaInstance;
}

async function getHostileNPCsByAreaInstanceId(id) {
  const sql = 'SELECT hostile_npcs FROM area_instances WHERE id = ?';
  const params = [id];
  const rows = await query(sql, params);
  return rows.length > 0 ? rows[0].hostile_npcs : null;
}

async function getFriendlyNPCsByAreaInstanceId(id) {
  const sql = 'SELECT friendly_npcs FROM area_instances WHERE id = ?';
  const params = [id];
  const rows = await query(sql, params);
  return rows.length > 0 ? rows[0].friendly_npcs : null;
}

module.exports = { createAreaInstance, getAreaInstanceById, getAllAreaInstances, getHostileNPCsByAreaInstanceId, getFriendlyNPCsByAreaInstanceId };
