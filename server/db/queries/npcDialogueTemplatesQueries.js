// db/queries/npcDialogueTemplatesQueries.js

const { query } = require('../database');
const NpcDialogueTemplate = require('../../models/NpcDialogueTemplate');

async function createNpcDialogueTemplate(description, script_path) {
  const sql = 'INSERT INTO npc_dialogue_templates (description, script_path) VALUES (?, ?)';
  const params = [description, script_path];
  const result = await query(sql, params);
  return result.insertId;
}

async function getNpcDialogueTemplateById(id) {
  const sql = 'SELECT * FROM npc_dialogue_templates WHERE id = ?';
  const params = [id];
  const rows = await query(sql, params);
  if (rows.length > 0) {
    return new NpcDialogueTemplate({
      id: rows[0].id,
      description: rows[0].description,
      script_path: rows[0].script_path
    });
  }
  return null;
}

async function getAllNpcDialogueTemplates() {
  const sql = 'SELECT * FROM npc_dialogue_templates';
  const rows = await query(sql);
  return rows.map(row => new NpcDialogueTemplate({
    id: row.id,
    description: row.description,
    script_path: row.script_path
  }));
}

module.exports = { 
  createNpcDialogueTemplate, 
  getNpcDialogueTemplateById, 
  getAllNpcDialogueTemplates 
};
