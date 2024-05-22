const { query } = require('../database');
const NpcTemplate = require('../../models/NpcTemplate');

async function getNPCTemplateByName(name) {
  const sql = 'SELECT * FROM npc_templates WHERE name = ?';
  const params = [name];
  const rows = await query(sql, params);
  if (rows.length > 0) {
    const npcTemplate = new NpcTemplate({
      ...rows[0],
      base_stats: rows[0].base_stats,
      loot_table: rows[0].loot_table
    });
    return npcTemplate;
  }
  return null;
}

async function getNPCTemplateById(id) {
  const sql = 'SELECT * FROM npc_templates WHERE id = ?';
  const params = [id];
  const rows = await query(sql, params);
  if (rows.length > 0) {
    const npcTemplate = new NpcTemplate({
      ...rows[0],
      base_stats: rows[0].base_stats,
      loot_table: rows[0].loot_table
    });
    return npcTemplate;
  }
  return null;
}

async function getAllNPCTemplates() {
  const sql = 'SELECT * FROM npc_templates';
  const rows = await query(sql);
  return rows.map(row => new NpcTemplate({
    ...row,
    base_stats: row.base_stats,
    loot_table: row.loot_table
  }));
}

module.exports = { getNPCTemplateByName, getNPCTemplateById, getAllNPCTemplates };
