const { query } = require('../database');

async function getAllClasses() {
  const sql = 'SELECT * FROM class_templates';
  const classes = await query(sql);
  return classes;
}

async function getClassStatScaling(className) {
  const sql = 'SELECT stat_level_scaling FROM class_templates WHERE name = ?';
  const params = [className];
  const rows = await query(sql, params);
  return rows.length > 0 ? rows[0].stat_level_scaling : null;
}

module.exports = { getAllClasses, getClassStatScaling };
