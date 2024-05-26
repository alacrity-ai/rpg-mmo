// db/queries/npcTemplatesQueries.js

const { query } = require('../database');
const NpcTemplate = require('../../models/NpcTemplate');
const { getNpcDialogueTemplateById } = require('./npcDialogueTemplatesQueries');

async function getNPCTemplateByName(name) {
  const sql = 'SELECT * FROM npc_templates WHERE name = ?';
  const params = [name];
  const rows = await query(sql, params);
  if (rows.length > 0) {
    return new NpcTemplate({
      ...rows[0],
      base_stats: rows[0].base_stats,
      loot_table: rows[0].loot_table,
      npc_dialogue_template_id: rows[0].npc_dialogue_template_id,
      battler_sprite_path: rows[0].battler_sprite_path
    });
  }
  return null;
}

async function getNPCTemplateById(id) {
  const sql = 'SELECT * FROM npc_templates WHERE id = ?';
  const params = [id];
  const rows = await query(sql, params);
  if (rows.length > 0) {
    return new NpcTemplate({
      ...rows[0],
      base_stats: rows[0].base_stats,
      loot_table: rows[0].loot_table,
      npc_dialogue_template_id: rows[0].npc_dialogue_template_id,
      battler_sprite_path: rows[0].battler_sprite_path
    });
  }
  return null;
}

async function getAllNPCTemplates() {
  const sql = 'SELECT * FROM npc_templates';
  const rows = await query(sql);
  return rows.map(row => new NpcTemplate({
    ...row,
    base_stats: row.base_stats,
    loot_table: row.loot_table,
    npc_dialogue_template_id: row.npc_dialogue_template_id,
    battler_sprite_path: row.battler_sprite_path
  }));
}

async function getNpcDialogueByNpcTemplateId(npcTemplateId) {
  const sql = 'SELECT npc_dialogue_template_id FROM npc_templates WHERE id = ?';
  const params = [npcTemplateId];
  const rows = await query(sql, params);
  if (rows.length > 0) {
    const dialogueTemplateId = rows[0].npc_dialogue_template_id;
    if (dialogueTemplateId) {
      return await getNpcDialogueTemplateById(dialogueTemplateId);
    }
  }
  return null;
}

module.exports = { 
  getNPCTemplateByName, 
  getNPCTemplateById, 
  getAllNPCTemplates,
  getNpcDialogueByNpcTemplateId
};
