const { query } = require('../database');
const ZoneInstance = require('../../models/ZoneInstance');

async function getZoneInstanceById(id) {
  const sql = 'SELECT * FROM zone_instances WHERE id = ?';
  const params = [id];
  const rows = await query(sql, params);
  if (rows.length > 0) {
    const zoneInstance = new ZoneInstance({
      ...rows[0],
      areas: rows[0].areas
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
    areas: row.areas
  }));
}

async function createZoneInstance(params) {
  const sql = 'INSERT INTO zone_instances (name, template_id, areas) VALUES (?, ?, ?)';
  const areas = JSON.stringify(params.areas);
  const result = await query(sql, [params.name, params.template_id, areas]);
  const zoneInstance = new ZoneInstance({
    id: result.insertId,
    name: params.name,
    template_id: params.template_id,
    areas: params.areas
  });
  return zoneInstance;
}

module.exports = { createZoneInstance, getZoneInstanceById, getAllZoneInstances };
