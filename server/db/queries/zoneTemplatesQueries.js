const { query } = require('../database');
const ZoneTemplate = require('../models/ZoneTemplate');

async function getZoneTemplateById(id) {
  const sql = 'SELECT * FROM zone_templates WHERE id = ?';
  const params = [id];
  const rows = await query(sql, params);
  if (rows.length > 0) {
    const zoneTemplate = new ZoneTemplate({
      ...rows[0],
      hostile_npcs: JSON.parse(rows[0].hostile_npcs),
      friendly_npcs: JSON.parse(rows[0].friendly_npcs)
    });
    return zoneTemplate;
  }
  return null;
}

async function getZoneTemplateByName(name) {
  const sql = 'SELECT * FROM zone_templates WHERE name = ?';
  const params = [name];
  const rows = await query(sql, params);
  if (rows.length > 0) {
    const zoneTemplate = new ZoneTemplate({
      ...rows[0],
      hostile_npcs: JSON.parse(rows[0].hostile_npcs),
      friendly_npcs: JSON.parse(rows[0].friendly_npcs)
    });
    return zoneTemplate;
  }
  return null;
}

async function getAllZoneTemplates() {
  const sql = 'SELECT * FROM zone_templates';
  const rows = await query(sql);
  return rows.map(row => new ZoneTemplate({
    ...row,
    hostile_npcs: JSON.parse(row.hostile_npcs),
    friendly_npcs: JSON.parse(row.friendly_npcs)
  }));
}

async function getHostileNPCsByZoneTemplateId(id) {
  const sql = 'SELECT hostile_npcs FROM zone_templates WHERE id = ?';
  const params = [id];
  const rows = await query(sql, params);
  return rows.length > 0 ? JSON.parse(rows[0].hostile_npcs) : null;
}

async function getFriendlyNPCsByZoneTemplateId(id) {
  const sql = 'SELECT friendly_npcs FROM zone_templates WHERE id = ?';
  const params = [id];
  const rows = await query(sql, params);
  return rows.length > 0 ? JSON.parse(rows[0].friendly_npcs) : null;
}

module.exports = { getZoneTemplateById, getZoneTemplateByName, getAllZoneTemplates, getHostileNPCsByZoneTemplateId, getFriendlyNPCsByZoneTemplateId };
