const { query } = require('../database');

async function getNpcStatusById(npcInstanceId) {
  const sql = 'SELECT * FROM npc_status WHERE npc_instance_id = ?';
  const params = [npcInstanceId];
  const rows = await query(sql, params);
  if (rows.length > 0) {
    const npcStatus = rows[0];
    npcStatus.statuses = JSON.parse(npcStatus.statuses);
    return npcStatus;
  }
  return null;
}

async function createNpcStatus(npcInstanceId, statuses) {
  const sql = 'INSERT INTO npc_status (npc_instance_id, statuses) VALUES (?, ?)';
  const params = [npcInstanceId, JSON.stringify(statuses)];
  const result = await query(sql, params);
  return result.insertId;
}

async function updateNpcStatus(npcInstanceId, statuses) {
  const sql = 'UPDATE npc_status SET statuses = ? WHERE npc_instance_id = ?';
  const params = [JSON.stringify(statuses), npcInstanceId];
  await query(sql, params);
}

async function addStatusToNpc(npcInstanceId, statusTemplateId) {
  const currentTime = new Date().toISOString();
  const statusEffect = { id: statusTemplateId, applied_at: currentTime };
  
  const existingStatus = await getNpcStatusById(npcInstanceId);
  
  if (existingStatus) {
    const statuses = existingStatus.statuses;
    statuses.push(statusEffect);
    await updateNpcStatus(npcInstanceId, statuses);
  } else {
    const statuses = [statusEffect];
    await createNpcStatus(npcInstanceId, statuses);
  }
}

async function removeStatusFromNpc(npcInstanceId, statusTemplateId) {
  const existingStatus = await getNpcStatusById(npcInstanceId);
  
  if (existingStatus) {
    let statuses = existingStatus.statuses;
    statuses = statuses.filter(status => status.id !== statusTemplateId);
    await updateNpcStatus(npcInstanceId, statuses);
  }
}

module.exports = { 
  getNpcStatusById, 
  createNpcStatus, 
  updateNpcStatus, 
  addStatusToNpc, 
  removeStatusFromNpc 
};
