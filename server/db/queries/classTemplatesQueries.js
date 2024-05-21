const { query } = require('../database');
const ClassTemplate = require('../../models/ClassTemplate');

async function getAllClasses() {
  const sql = 'SELECT * FROM class_templates';
  const classes = await query(sql);
  return classes.map(classTemplate => new ClassTemplate({
    ...classTemplate,
    base_stats: JSON.parse(classTemplate.base_stats),
    stat_level_scaling: JSON.parse(classTemplate.stat_level_scaling)
  }));
}

async function getClassTemplateByName(name) {
  const sql = 'SELECT * FROM class_templates WHERE name = ?';
  const params = [name];
  const rows = await query(sql, params);
  if (rows.length > 0) {
    try {
      console.log('Row retrieved:', rows[0]);
      const baseStats = typeof rows[0].base_stats === 'string' ? JSON.parse(rows[0].base_stats) : rows[0].base_stats;
      const statLevelScaling = typeof rows[0].stat_level_scaling === 'string' ? JSON.parse(rows[0].stat_level_scaling) : rows[0].stat_level_scaling;
      return new ClassTemplate({
        ...rows[0],
        base_stats: baseStats,
        stat_level_scaling: statLevelScaling
      });
    } catch (err) {
      console.error('Error parsing class template stats:', err.message, 'Base stats:', rows[0].base_stats, 'Stat level scaling:', rows[0].stat_level_scaling);
      throw err;
    }
  }
  return null;
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

module.exports = { getAllClasses, getClassTemplateByName, getClassStatScaling };
