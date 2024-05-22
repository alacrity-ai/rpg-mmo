// db/queries/encounterTemplatesQueries.js

const { query } = require('../database');
const EncounterTemplate = require('../../models/EncounterTemplate');

async function getEncounterTemplateById(id) {
  const sql = 'SELECT * FROM encounter_templates WHERE id = ?';
  const params = [id];
  const rows = await query(sql, params);
  if (rows.length > 0) {
    return new EncounterTemplate({
      ...rows[0],
      enemies: rows[0].enemies
    });
  }
  return null;
}

async function getEncounterTemplateByName(name) {
  const sql = 'SELECT * FROM encounter_templates WHERE name = ?';
  const params = [name];
  const rows = await query(sql, params);
  if (rows.length > 0) {
    return new EncounterTemplate({
      ...rows[0],
      enemies: rows[0].enemies
    });
  }
  return null;
}

async function getAllEncounterTemplates() {
  const sql = 'SELECT * FROM encounter_templates';
  const rows = await query(sql);
  return rows.map(row => new EncounterTemplate({
    ...row,
    enemies: row.enemies
  }));
}

module.exports = {
  getEncounterTemplateById,
  getEncounterTemplateByName,
  getAllEncounterTemplates
};
