const { query } = require('../database');

async function getZoneInstanceById(id) {
  const sql = 'SELECT * FROM zone_instances WHERE id = ?';
  const params = [id];
  const rows = await query(sql, params);
  if (rows.length > 0) {
    const zoneInstance = rows[0];
    zoneInstance.areas = JSON.parse(zoneInstance.areas);
    return zoneInstance;
  }
  return null;
}

async function getAllZoneInstances() {
  const sql = 'SELECT * FROM zone_instances';
  const rows = await query(sql);
  return rows.map(row => ({
    ...row,
    areas: JSON.parse(row.areas)
  }));
}

module.exports = { getZoneInstanceById, getAllZoneInstances };
