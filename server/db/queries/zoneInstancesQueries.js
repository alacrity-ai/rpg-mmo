const { query } = require('../database');
const ZoneInstance = require('../models/ZoneInstance');

async function getZoneInstanceById(id) {
  const sql = 'SELECT * FROM zone_instances WHERE id = ?';
  const params = [id];
  const rows = await query(sql, params);
  if (rows.length > 0) {
    const zoneInstance = new ZoneInstance({
      ...rows[0],
      areas: JSON.parse(rows[0].areas)
    });
    return zoneInstance;
  }
  return null;
}

async function getAllZoneInstances() {
  const sql = 'SELECT * FROM zone_instances';
  const rows = await query(sql);
  return rows.map(row => new ZoneInstance({
    ...row,
    areas: JSON.parse(row.areas)
  }));
}

module.exports = { getZoneInstanceById, getAllZoneInstances };
