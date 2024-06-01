const { query } = require('../database');
const { getZoneInstanceById } = require('./zoneInstancesQueries');
const AreaInstance = require('../../models/AreaInstance');

async function getAreaInstanceById(id) {
  const sql = 'SELECT * FROM area_instances WHERE id = ?';
  const params = [id];
  const rows = await query(sql, params);
  if (rows.length > 0) {
    const areaInstance = new AreaInstance({
      ...rows[0],
      area_connections: rows[0].area_connections,
      friendly_npcs: rows[0].friendly_npcs,
      encounter_cleared: rows[0].encounter_cleared,
      created_at: rows[0].created_at
    });
    return areaInstance;
  }
  return null;
}

async function getAllAreaInstances() {
  const sql = 'SELECT * FROM area_instances';
  const rows = await query(sql);
  return rows.map(row => new AreaInstance({
    ...row,
    area_connections: row.area_connections,
    friendly_npcs: row.friendly_npcs,
    encounter_cleared: row.encounter_cleared,
    created_at: row.created_at
  }));
}

async function createAreaInstance(areaInstanceData) {
  const sql = `
    INSERT INTO area_instances (
      zone_name,
      zone_instance_id,
      zone_template_id,
      music_path,
      ambient_sound_path,
      background_image,
      area_connections,
      encounter,
      encounter_cleared,
      friendly_npcs,
      explored,
      event_instance_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [
    areaInstanceData.zone_name || null,
    areaInstanceData.zone_instance_id || null,
    areaInstanceData.zone_template_id || null,
    areaInstanceData.music_path || null,
    areaInstanceData.ambient_sound_path || null,
    areaInstanceData.background_image || null,
    JSON.stringify(areaInstanceData.area_connections) || null,
    areaInstanceData.encounter || null,
    areaInstanceData.encounter_cleared !== undefined ? areaInstanceData.encounter_cleared : false,
    JSON.stringify(areaInstanceData.friendly_npcs) || null,
    areaInstanceData.explored !== undefined ? areaInstanceData.explored : false,
    areaInstanceData.event_instance_id || null
  ];
  const result = await query(sql, params);
  return result.insertId;
}


async function updateAreaInstance(id, areaInstanceData) {
  const sql = `
    UPDATE area_instances SET
      zone_name = ?,
      zone_instance_id = ?,
      zone_template_id = ?,
      music_path = ?,
      ambient_sound_path = ?,
      background_image = ?,
      area_connections = ?,
      encounter = ?,
      encounter_cleared = ?,
      friendly_npcs = ?,
      explored = ?,
      event_instance_id = ?
    WHERE id = ?
  `;
  const params = [
    areaInstanceData.zone_name,
    areaInstanceData.zone_instance_id,
    areaInstanceData.zone_template_id,
    areaInstanceData.music_path,
    areaInstanceData.ambient_sound_path,
    areaInstanceData.background_image,
    JSON.stringify(areaInstanceData.area_connections),
    areaInstanceData.encounter,
    areaInstanceData.encounter_cleared,
    JSON.stringify(areaInstanceData.friendly_npcs),
    areaInstanceData.explored,
    areaInstanceData.event_instance_id,
    id
  ];
  await query(sql, params);
}

async function updateAreaInstancesWithZoneInstanceData(areaInstanceIds, zoneInstanceId) {
  const zoneInstance = await getZoneInstanceById(zoneInstanceId);
  if (!zoneInstance) {
    throw new Error('Zone instance not found');
  }

  const areaConnections = zoneInstance.areas;

  for (const areaInstanceId of areaInstanceIds) {
    const connections = areaConnections[areaInstanceId] || {};
    const sql = `
      UPDATE area_instances SET
        zone_instance_id = ?,
        area_connections = ?
      WHERE id = ?
    `;
    const params = [
      zoneInstanceId,
      JSON.stringify(connections),
      areaInstanceId
    ];
    await query(sql, params);
  }
}

async function deleteAreaInstance(id) {
  const sql = 'DELETE FROM area_instances WHERE id = ?';
  const params = [id];
  await query(sql, params);
}

module.exports = {
  updateAreaInstancesWithZoneInstanceData,
  getAreaInstanceById,
  getAllAreaInstances,
  createAreaInstance,
  updateAreaInstance,
  deleteAreaInstance
};
