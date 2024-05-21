const { query } = require('../database');
const CharacterStatus = require('../../models/CharacterStatus');

async function getCharacterStatusById(characterId) {
  const sql = 'SELECT * FROM character_status WHERE character_id = ?';
  const params = [characterId];
  const rows = await query(sql, params);
  if (rows.length > 0) {
    const characterStatus = rows[0];
    characterStatus.statuses = JSON.parse(characterStatus.statuses);
    return new CharacterStatus(characterStatus);
  }
  return null;
}

async function createCharacterStatus(characterId, statuses) {
  const sql = 'INSERT INTO character_status (character_id, statuses) VALUES (?, ?)';
  const params = [characterId, JSON.stringify(statuses)];
  const result = await query(sql, params);
  return result.insertId;
}

async function updateCharacterStatus(characterId, statuses) {
  const sql = 'UPDATE character_status SET statuses = ? WHERE character_id = ?';
  const params = [JSON.stringify(statuses), characterId];
  await query(sql, params);
}

async function addStatusToCharacter(characterId, statusTemplateId) {
  const currentTime = new Date().toISOString();
  const statusEffect = { id: statusTemplateId, applied_at: currentTime };
  
  const existingStatus = await getCharacterStatusById(characterId);
  
  if (existingStatus) {
    const statuses = existingStatus.statuses;
    statuses.push(statusEffect);
    await updateCharacterStatus(characterId, statuses);
  } else {
    const statuses = [statusEffect];
    await createCharacterStatus(characterId, statuses);
  }
}

async function removeStatusFromCharacter(characterId, statusTemplateId) {
  const existingStatus = await getCharacterStatusById(characterId);
  
  if (existingStatus) {
    let statuses = existingStatus.statuses;
    statuses = statuses.filter(status => status.id !== statusTemplateId);
    await updateCharacterStatus(characterId, statuses);
  }
}

module.exports = { 
  getCharacterStatusById, 
  createCharacterStatus, 
  updateCharacterStatus, 
  addStatusToCharacter, 
  removeStatusFromCharacter 
};
