// db/queries/characterFlagTemplatesQueries.js

const { query } = require('../database');
const CharacterFlagTemplate = require('../../models/CharacterFlagTemplate');


async function getCharacterFlagTemplateById(id) {
  const sql = 'SELECT * FROM character_flag_templates WHERE id = ?';
  const params = [id];
  const rows = await query(sql, params);
  if (rows.length > 0) {
    return new CharacterFlagTemplate({
      id: rows[0].id,
      name: rows[0].name,
      description: rows[0].description
    });
  }
  return null;
}

async function getCharacterFlagTemplateByName(name) {
  const sql = 'SELECT * FROM character_flag_templates WHERE name = ?';
  const params = [name];
  const rows = await query(sql, params);
  if (rows.length > 0) {
    return new CharacterFlagTemplate({
      id: rows[0].id,
      name: rows[0].name,
      description: rows[0].description
    });
  }
  return null;
}

async function getAllCharacterFlagTemplates() {
  const sql = 'SELECT * FROM character_flag_templates';
  const rows = await query(sql);
  return rows.map(row => new CharacterFlagTemplate({
    id: row.id,
    name: row.name,
    description: row.description
  }));
}

module.exports = { 
  getCharacterFlagTemplateById, 
  getCharacterFlagTemplateByName, 
  getAllCharacterFlagTemplates 
};
