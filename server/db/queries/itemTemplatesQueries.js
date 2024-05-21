const { query } = require('../database');
const ItemTemplate = require('../../models/ItemTemplate');

async function getItemTemplateById(id) {
  const sql = 'SELECT * FROM item_templates WHERE id = ?';
  const params = [id];
  const rows = await query(sql, params);
  if (rows.length > 0) {
    const itemTemplate = rows[0];
    itemTemplate.stats = JSON.parse(itemTemplate.stats);
    itemTemplate.use_effect = JSON.parse(itemTemplate.use_effect);
    itemTemplate.classes = itemTemplate.classes.split(',').map(Number);
    return new ItemTemplate(itemTemplate);
  }
  return null;
}

async function getItemTemplateByName(name) {
  const sql = 'SELECT * FROM item_templates WHERE name = ?';
  const params = [name];
  const rows = await query(sql, params);
  if (rows.length > 0) {
    const itemTemplate = rows[0];
    itemTemplate.stats = JSON.parse(itemTemplate.stats);
    itemTemplate.use_effect = JSON.parse(itemTemplate.use_effect);
    itemTemplate.classes = itemTemplate.classes.split(',').map(Number);
    return new ItemTemplate(itemTemplate);
  }
  return null;
}

async function getAllItemTemplates() {
  const sql = 'SELECT * FROM item_templates';
  const rows = await query(sql);
  return rows.map(row => {
    row.stats = JSON.parse(row.stats);
    row.use_effect = JSON.parse(row.use_effect);
    row.classes = row.classes.split(',').map(Number);
    return new ItemTemplate(row);
  });
}

module.exports = {
  getItemTemplateById,
  getItemTemplateByName,
  getAllItemTemplates,
};
