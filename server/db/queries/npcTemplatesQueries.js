const { query } = require('../database');

async function getNPCTemplateByName(name) {
  const sql = 'SELECT * FROM npc_templates WHERE name = ?';
  const params = [name];
  const rows = await query(sql, params);
  if (rows.length > 0) {
    const npcTemplate = rows[0];
    npcTemplate.base_stats = JSON.parse(npcTemplate.base_stats);
    npcTemplate.loot_table = JSON.parse(npcTemplate.loot_table);
    return npcTemplate;
  }
  return null;
}

async function getNPCTemplateById(id) {
  const sql = 'SELECT * FROM npc_templates WHERE id = ?';
  const params = [id];
  const rows = await query(sql, params);
  if (rows.length > 0) {
    const npcTemplate = rows[0];
    npcTemplate.base_stats = JSON.parse(npcTemplate.base_stats);
    npcTemplate.loot_table = JSON.parse(npcTemplate.loot_table);
    return npcTemplate;
  }
  return null;
}

async function getAllNPCTemplates() {
  const sql = 'SELECT * FROM npc_templates';
  const rows = await query(sql);
  return rows.map(row => ({
    ...row,
    base_stats: JSON.parse(row.base_stats),
    loot_table: JSON.parse(row.loot_table)
  }));
}

module.exports = { getNPCTemplateByName, getNPCTemplateById, getAllNPCTemplates };
