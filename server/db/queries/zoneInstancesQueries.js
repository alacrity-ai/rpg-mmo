// db/queries/zoneInstancesQueries.js

const { query } = require('../database');
const ZoneInstance = require('../../models/ZoneInstance');

async function getZoneInstanceById(id) {
  const sql = 'SELECT * FROM zone_instances WHERE id = ?';
  const params = [id];
  const rows = await query(sql, params);
  if (rows.length > 0) {
    return new ZoneInstance({
      id: rows[0].id,
      name: rows[0].name,
      template_id: rows[0].template_id,
      areas: rows[0].areas,
      created_at: rows[0].created_at
    });
  }
  return null;
}

async function getAllZoneInstances() {
  const sql = 'SELECT * FROM zone_instances';
  const rows = await query(sql);
  return rows.map(row => new ZoneInstance({
    id: row.id,
    name: row.name,
    template_id: row.template_id,
    areas: row.areas,
    created_at: row.created_at
  }));
}

async function createZoneInstance(params) {
  const sql = 'INSERT INTO zone_instances (name, template_id, areas, created_at) VALUES (?, ?, ?, ?)';
  const areas = JSON.stringify(params.areas);
  const result = await query(sql, [params.name, params.template_id, areas, new Date()]);
  const zoneInstance = new ZoneInstance({
    id: result.insertId,
    name: params.name,
    template_id: params.template_id,
    areas: params.areas,
    created_at: new Date() // Assuming the current timestamp
  });
  return zoneInstance;
}

module.exports = {
  createZoneInstance,
  getZoneInstanceById,
  getAllZoneInstances
};
