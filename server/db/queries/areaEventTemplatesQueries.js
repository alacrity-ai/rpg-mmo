// db/queries/areaEventTemplatesQueries.js

const { query } = require('../database');
const AreaEventTemplate = require('../../models/AreaEventTemplate');

/**
 * Get an area event template by its ID.
 * @param {number} id - The ID of the event template.
 * @returns {Promise<AreaEventTemplate|null>} The event template or null if not found.
 */
async function getAreaEventTemplateById(id) {
  const sql = 'SELECT * FROM area_event_templates WHERE id = ?';
  const params = [id];
  const rows = await query(sql, params);
  if (rows.length > 0) {
    return new AreaEventTemplate({
      id: rows[0].id,
      name: rows[0].name,
      event_script: rows[0].event_script
    });
  }
  return null;
}

/**
 * Get all area event templates.
 * @returns {Promise<AreaEventTemplate[]>} The list of all event templates.
 */
async function getAllAreaEventTemplates() {
  const sql = 'SELECT * FROM area_event_templates';
  const rows = await query(sql);
  return rows.map(row => new AreaEventTemplate({
    id: row.id,
    name: row.name,
    event_script: row.event_script
  }));
}

module.exports = {
  getAreaEventTemplateById,
  getAllAreaEventTemplates,
};
