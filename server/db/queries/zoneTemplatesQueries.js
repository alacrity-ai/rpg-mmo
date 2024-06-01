const { query } = require('../database');
const ZoneTemplate = require('../../models/ZoneTemplate');

async function getZoneTemplateById(id) {
  const sql = 'SELECT * FROM zone_templates WHERE id = ?';
  const params = [id];
  const rows = await query(sql, params);
  if (rows.length > 0) {
    const zoneTemplate = new ZoneTemplate({
      ...rows[0],
      encounters: rows[0].encounters,
      friendlyNpcs: rows[0].friendly_npcs,
      areaEvents: rows[0].area_events
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
      encounters: rows[0].encounters,
      friendlyNpcs: rows[0].friendly_npcs,
      areaEvents: rows[0].area_events
    });
    return zoneTemplate;
  }
  return null;
}

async function getZoneTemplateBySceneKey(sceneKey) {
  const sql = 'SELECT * FROM zone_templates WHERE scene_key = ?';
  const params = [sceneKey];
  const rows = await query(sql, params);
  if (rows.length > 0) {
    const zoneTemplate = new ZoneTemplate({
      ...rows[0],
      encounters: rows[0].encounters,
      friendlyNpcs: rows[0].friendly_npcs,
      areaEvents: rows[0].area_events
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
    encounters: row.encounters,
    friendlyNpcs: row.friendly_npcs,
    areaEvents: row.area_events
  }));
}

async function getEncountersByZoneTemplateId(id) {
  const sql = 'SELECT encounters FROM zone_templates WHERE id = ?';
  const params = [id];
  const rows = await query(sql, params);
  return rows.length > 0 ? rows[0].encounters : null;
}

async function getFriendlyNPCsByZoneTemplateId(id) {
  const sql = 'SELECT friendly_npcs FROM zone_templates WHERE id = ?';
  const params = [id];
  const rows = await query(sql, params);
  return rows.length > 0 ? rows[0].friendly_npcs : null;
}

async function getAreaEventsByZoneTemplateId(id) {
  const sql = 'SELECT area_events FROM zone_templates WHERE id = ?';
  const params = [id];
  const rows = await query(sql, params);
  return rows.length > 0 ? rows[0].area_events : null;
}

module.exports = { 
  getZoneTemplateById, 
  getZoneTemplateByName, 
  getAllZoneTemplates, 
  getEncountersByZoneTemplateId, 
  getFriendlyNPCsByZoneTemplateId,
  getAreaEventsByZoneTemplateId,
  getZoneTemplateBySceneKey
};
