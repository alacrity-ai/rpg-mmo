// db/queries/areaInstancesQueries.js

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
      encounter: rows[0].encounter,
      friendlyNpcs: rows[0].friendly_npcs,
      created_at: rows[0].created_at
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
    encounter: row.encounter,
    friendlyNpcs: row.friendly_npcs,
    created_at: row.created_at
  }));
}

async function createAreaInstance(params) {
  const sql = 'INSERT INTO area_instances (background_image, encounter, friendly_npcs, created_at) VALUES (?, ?, ?, ?)';
  const friendlyNpcs = JSON.stringify(params.friendlyNpcs);
  const result = await query(sql, [params.background_image, params.encounter, friendlyNpcs, new Date()]);
  const areaInstance = new AreaInstance({
    id: result.insertId,
    background_image: params.background_image,
    encounter: params.encounter,
    friendlyNpcs: params.friendlyNpcs,
    created_at: new Date()
  });
  return areaInstance;
}

async function getEncounterByAreaInstanceId(id) {
  const sql = 'SELECT encounter FROM area_instances WHERE id = ?';
  const params = [id];
  const rows = await query(sql, params);
  return rows.length > 0 ? rows[0].encounter : null;
}

async function getFriendlyNPCsByAreaInstanceId(id) {
  const sql = 'SELECT friendly_npcs FROM area_instances WHERE id = ?';
  const params = [id];
  const rows = await query(sql, params);
  return rows.length > 0 ? rows[0].friendly_npcs : null;
}

module.exports = {
  createAreaInstance,
  getAreaInstanceById,
  getAllAreaInstances,
  getEncounterByAreaInstanceId,
  getFriendlyNPCsByAreaInstanceId
};
