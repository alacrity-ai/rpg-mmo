const { query } = require('../database');
const NpcInstance = require('../../models/NpcInstance');

async function getNpcInstanceById(npcInstanceId) {
  const sql = 'SELECT * FROM npc_instances WHERE id = ?';
  const params = [npcInstanceId];
  const rows = await query(sql, params);
  if (rows.length > 0) {
    const npcInstance = rows[0];
    npcInstance.base_stats = npcInstance.base_stats;
    npcInstance.current_stats = npcInstance.current_stats;
    return new NpcInstance(npcInstance);
  }
  return null;
}

async function getNpcInstancesByAreaId(areaId) {
  const sql = 'SELECT * FROM npc_instances WHERE current_area_id = ?';
  const params = [areaId];
  const rows = await query(sql, params);
  return rows.map(row => {
    row.base_stats = row.base_stats;
    row.current_stats = row.current_stats;
    return new NpcInstance(row);
  });
}

async function getLootTableByNpcInstanceId(npcInstanceId) {
  const sql = `
    SELECT npc_templates.loot_table
    FROM npc_instances
    JOIN npc_templates ON npc_instances.npc_template_id = npc_templates.id
    WHERE npc_instances.id = ?
  `;
  const params = [npcInstanceId];
  const rows = await query(sql, params);
  return rows.length > 0 ? rows[0].loot_table : null;
}

module.exports = { getNpcInstanceById, getNpcInstancesByAreaId, getLootTableByNpcInstanceId };
