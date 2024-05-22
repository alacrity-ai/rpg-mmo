// db/queries/npcDialogueInstancesQueries.js

const { query } = require('../database');
const NpcDialogueInstance = require('../../models/NpcDialogueInstance');

async function createNpcDialogueInstance(npcDialogueTemplateId, characterId) {
  const sql = 'INSERT INTO npc_dialogue_instances (npc_dialogue_template_id, character_id, state) VALUES (?, ?, ?)';
  const params = [npcDialogueTemplateId, characterId, 0];
  const result = await query(sql, params);
  return result.insertId;
}

async function getNpcDialogueInstanceById(id) {
  const sql = 'SELECT * FROM npc_dialogue_instances WHERE id = ?';
  const params = [id];
  const rows = await query(sql, params);
  if (rows.length > 0) {
    return new NpcDialogueInstance({
      id: rows[0].id,
      npc_dialogue_template_id: rows[0].npc_dialogue_template_id,
      character_id: rows[0].character_id,
      state: rows[0].state
    });
  }
  return null;
}

async function updateNpcDialogueInstanceState(id, state) {
  const sql = 'UPDATE npc_dialogue_instances SET state = ? WHERE id = ?';
  const params = [state, id];
  await query(sql, params);
}

async function getNpcDialogueInstanceByCharacter(characterId) {
  const sql = 'SELECT * FROM npc_dialogue_instances WHERE character_id = ?';
  const params = [characterId];
  const rows = await query(sql, params);
  if (rows.length > 0) {
    return new NpcDialogueInstance({
      id: rows[0].id,
      npc_dialogue_template_id: rows[0].npc_dialogue_template_id,
      character_id: rows[0].character_id,
      state: rows[0].state
    });
  }
  return null;
}

async function getNpcDialogueInstanceByCharacterAndTemplate(characterId, npcDialogueTemplateId) {
  const sql = 'SELECT * FROM npc_dialogue_instances WHERE character_id = ? AND npc_dialogue_template_id = ?';
  const params = [characterId, npcDialogueTemplateId];
  const rows = await query(sql, params);
  if (rows.length > 0) {
    return new NpcDialogueInstance({
      id: rows[0].id,
      npc_dialogue_template_id: rows[0].npc_dialogue_template_id,
      character_id: rows[0].character_id,
      state: rows[0].state
    });
  }
  return null;
}

async function getNpcDialogueInstanceState(id) {
  const sql = 'SELECT state FROM npc_dialogue_instances WHERE id = ?';
  const params = [id];
  const rows = await query(sql, params);
  if (rows.length > 0) {
    return rows[0].state;
  }
  return null;
}

module.exports = { 
  createNpcDialogueInstance, 
  getNpcDialogueInstanceById, 
  updateNpcDialogueInstanceState,
  getNpcDialogueInstanceByCharacter,
  getNpcDialogueInstanceByCharacterAndTemplate,
  getNpcDialogueInstanceState
};
