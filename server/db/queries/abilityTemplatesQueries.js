const { query } = require('../database');
const AbilityTemplate = require('../../models/AbilityTemplate');

/**
 * Fetch an ability template by its ID.
 * @param {number} id - The ID of the ability template.
 * @returns {Promise<AbilityTemplate|null>} - A promise that resolves to an AbilityTemplate instance or null if not found.
 */
async function getAbilityTemplateById(id) {
  const sql = 'SELECT * FROM ability_templates WHERE id = ?';
  const params = [id];
  const rows = await query(sql, params);
  if (rows.length > 0) {
    return new AbilityTemplate({
      id: rows[0].id,
      name: rows[0].name,
      short_name: rows[0].short_name,
      description: rows[0].description,
      type: rows[0].type,
      potency: rows[0].potency,
      cost: rows[0].cost,
      target_team: rows[0].target_team,
      target_type: rows[0].target_type,
      target_area: rows[0].target_area,
      cooldown_duration: rows[0].cooldown_duration,
      icon_name: rows[0].icon_name,
      sound_path: rows[0].sound_path
    });
  }
  return null;
}

/**
 * Fetch an ability template by its short name.
 * @param {string} short_name - The short name of the ability template.
 * @returns {Promise<AbilityTemplate|null>} - A promise that resolves to an AbilityTemplate instance or null if not found.
 */
async function getAbilityTemplateByShortName(short_name) {
  const sql = 'SELECT * FROM ability_templates WHERE short_name = ?';
  const params = [short_name];
  const rows = await query(sql, params);
  if (rows.length > 0) {
    return new AbilityTemplate({
      id: rows[0].id,
      name: rows[0].name,
      short_name: rows[0].short_name,
      description: rows[0].description,
      type: rows[0].type,
      potency: rows[0].potency,
      cost: rows[0].cost,
      target_team: rows[0].target_team,
      target_type: rows[0].target_type,
      target_area: rows[0].target_area,
      cooldown_duration: rows[0].cooldown_duration,
      icon_name: rows[0].icon_name,
      sound_path: rows[0].sound_path
    });
  }
  return null;
}

async function getAbilityTemplatesByShortNames(short_names) {
    const sql = `SELECT * FROM ability_templates WHERE short_name IN (${short_names.map(() => '?').join(',')})`;
    const params = short_names;
    const rows = await query(sql, params);
    return rows.map(row => new AbilityTemplate({
        id: row.id,
        name: row.name,
        short_name: row.short_name,
        description: row.description,
        type: row.type,
        potency: row.potency,
        cost: row.cost,
        target_team: row.target_team,
        target_type: row.target_type,
        target_area: row.target_area,
        cooldown_duration: row.cooldown_duration,
        icon_name: row.icon_name,
        sound_path: row.sound_path
    }));
}

module.exports = {
getAbilityTemplatesByShortNames,
  getAbilityTemplateById,
  getAbilityTemplateByShortName
};
