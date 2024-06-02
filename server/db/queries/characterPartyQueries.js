const { query } = require('../database');
const CharacterParty = require('../../models/CharacterParty');
const { getCharactersByIds } = require('./characterQueries');

async function createCharacterParty(members) {
  const membersJson = JSON.stringify({ members });
  const sql = 'INSERT INTO character_parties (party_members) VALUES (?)';
  const params = [membersJson];
  const result = await query(sql, params);
  return result.insertId;
}

async function getCharacterParty(partyId) {
  const sql = 'SELECT * FROM character_parties WHERE id = ?';
  const params = [partyId];
  const rows = await query(sql, params);
  if (rows.length > 0) {
    return new CharacterParty({
      id: rows[0].id,
      members: rows[0].party_members.members,
    });
  }
  return null;
}

async function addMemberToParty(partyId, userId, characterId) {
  const party = await getCharacterParty(partyId);
  if (!party) {
    throw new Error(`Party with ID ${partyId} not found`);
  }
  if (party.members.length >= 4) {
    throw new Error(`Party with ID ${partyId} is already full`);
  }
  party.members.push({ user_id: userId, character_id: characterId });
  const updatedMembersJson = JSON.stringify({ members: party.members });
  const sql = 'UPDATE character_parties SET party_members = ? WHERE id = ?';
  const params = [updatedMembersJson, partyId];
  await query(sql, params);
}

async function removeMemberFromParty(partyId, characterId) {
  const party = await getCharacterParty(partyId);
  if (!party) {
    throw new Error(`Party with ID ${partyId} not found`);
  }
  party.members = party.members.filter(member => member.character_id !== characterId);

  if (party.members.length === 0) {
    // Delete the party row if no members are left
    const deleteSql = 'DELETE FROM character_parties WHERE id = ?';
    await query(deleteSql, [partyId]);
  } else {
    const updatedMembersJson = JSON.stringify({ members: party.members });
    const updateSql = 'UPDATE character_parties SET party_members = ? WHERE id = ?';
    const params = [updatedMembersJson, partyId];
    await query(updateSql, params);
  }
}

async function getCharactersInParty(partyId) {
  const party = await getCharacterParty(partyId);
  if (!party) {
    throw new Error(`Party with ID ${partyId} not found`);
  }
  const characterIds = party.members.map(member => member.character_id);
  const characters = await getCharactersByIds(characterIds);
  return characters;
}

module.exports = {
  createCharacterParty,
  getCharacterParty,
  addMemberToParty,
  removeMemberFromParty,
  getCharactersInParty
};
