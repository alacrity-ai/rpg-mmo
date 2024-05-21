const { query } = require('../database');

async function getStatusEffectById(id) {
  const sql = 'SELECT * FROM status_templates WHERE id = ?';
  const params = [id];
  const rows = await query(sql, params);
  if (rows.length > 0) {
    const statusEffect = rows[0];
    statusEffect.effect_details = JSON.parse(statusEffect.effect_details);
    return statusEffect;
  }
  return null;
}

async function getAllStatusEffects() {
  const sql = 'SELECT * FROM status_templates';
  const rows = await query(sql);
  return rows.map(row => ({
    ...row,
    effect_details: JSON.parse(row.effect_details)
  }));
}

async function getStatusEffectsByType(effectType) {
  const sql = 'SELECT * FROM status_templates WHERE effect_type = ?';
  const params = [effectType];
  const rows = await query(sql, params);
  return rows.map(row => ({
    ...row,
    effect_details: JSON.parse(row.effect_details)
  }));
}

module.exports = { getStatusEffectById, getAllStatusEffects, getStatusEffectsByType };
