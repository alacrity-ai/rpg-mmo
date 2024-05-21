require('dotenv').config();
const { pool } = require('./database');
const itemTemplates = require('./data/itemTemplates');
const npcTemplates = require('./data/npcTemplates');

async function populateItemTemplates() {
  const connection = await pool.getConnection();
  try {
    for (const item of itemTemplates) {
      const [rows] = await connection.query(
        `SELECT * FROM item_templates WHERE name = ?`,
        [item.name]
      );

      if (rows.length === 0) {
        await connection.query(
          `INSERT INTO item_templates (name, description, item_type, is_equipment, equipment_type, icon_key, stats, is_collectible, use_effect)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            item.name,
            item.description,
            item.item_type,
            item.is_equipment,
            item.equipment_type,
            item.icon_key,
            item.stats,
            item.is_collectible,
            item.use_effect
          ]
        );
      }
    }
    console.log('Item templates populated.');
  } catch (err) {
    console.error('Error populating item templates', err);
  } finally {
    connection.release();
  }
}

async function populateNpcTemplates() {
  const connection = await pool.getConnection();
  try {
    for (const npc of npcTemplates) {
      const [rows] = await connection.query(
        `SELECT * FROM npc_templates WHERE name = ?`,
        [npc.name]
      );

      if (rows.length === 0) {
        await connection.query(
          `INSERT INTO npc_templates (name, sprite_key, description, script_path, base_stats)
          VALUES (?, ?, ?, ?, ?)`,
          [
            npc.name,
            npc.sprite_key,
            npc.description,
            npc.script_path,
            npc.base_stats
          ]
        );
      }
    }
    console.log('NPC templates populated.');
  } catch (err) {
    console.error('Error populating NPC templates', err);
  } finally {
    connection.release();
  }
}

async function populateTables() {
  await populateItemTemplates();
  await populateNpcTemplates();
  console.log('All tables populated.');
}

module.exports = { populateTables };
