const { query } = require('../database');

async function getAllClasses() {
  const sql = 'SELECT * FROM class_templates';
  const classes = await query(sql);
  return classes.map(classTemplate => ({
    ...classTemplate,
    base_stats: JSON.parse(classTemplate.base_stats),
    stat_level_scaling: JSON.parse(classTemplate.stat_level_scaling)
  }));
}

async function getClassStatScaling(className) {
  const sql = 'SELECT stat_level_scaling FROM class_templates WHERE name = ?';
  const params = [className];
  const rows = await query(sql, params);
  if (rows.length > 0) {
    return JSON.parse(rows[0].stat_level_scaling);
  }
  return null;
}

module.exports = { getAllClasses, getClassStatScaling };
