const { query } = require('../database');
const ShopTemplate = require('../models/ShopTemplate');

async function getShopTemplateById(id) {
  const sql = 'SELECT * FROM shop_templates WHERE id = ?';
  const params = [id];
  const rows = await query(sql, params);
  if (rows.length > 0) {
    const shopTemplate = new ShopTemplate({
      ...rows[0],
      inventory: rows[0].inventory
    });
    return shopTemplate;
  }
  return null;
}

async function getShopTemplateByName(name) {
  const sql = 'SELECT * FROM shop_templates WHERE name = ?';
  const params = [name];
  const rows = await query(sql, params);
  if (rows.length > 0) {
    const shopTemplate = new ShopTemplate({
      ...rows[0],
      inventory: rows[0].inventory
    });
    return shopTemplate;
  }
  return null;
}

async function getAllShopTemplates() {
  const sql = 'SELECT * FROM shop_templates';
  const rows = await query(sql);
  return rows.map(row => new ShopTemplate({
    ...row,
    inventory: row.inventory
  }));
}

module.exports = {
  getShopTemplateById,
  getShopTemplateByName,
  getAllShopTemplates
};
