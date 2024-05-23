// test/utils/dbHelpers.js
require('dotenv').config();
const mysql = require('mysql2/promise');
const { initTables } = require('../../db/database');

async function resetDatabase() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 20,
    queueLimit: 0
  });

  const dropTableQueries = [
    'SET FOREIGN_KEY_CHECKS = 0;',
    'DROP TABLE IF EXISTS area_event_instances;',
    'DROP TABLE IF EXISTS area_event_templates;',
    'DROP TABLE IF EXISTS npc_dialogue_instances;',
    'DROP TABLE IF EXISTS npc_dialogue_templates;',
    'DROP TABLE IF EXISTS character_flag_templates;',
    'DROP TABLE IF EXISTS encounter_templates;',
    'DROP TABLE IF EXISTS zone_templates;',
    'DROP TABLE IF EXISTS zone_instances;',
    'DROP TABLE IF EXISTS area_instances;',
    'DROP TABLE IF EXISTS characters;',
    'DROP TABLE IF EXISTS character_status;',
    'DROP TABLE IF EXISTS character_parties;',
    'DROP TABLE IF EXISTS class_templates;',
    'DROP TABLE IF EXISTS item_instances;',
    'DROP TABLE IF EXISTS item_templates;',
    'DROP TABLE IF EXISTS npc_instances;',
    'DROP TABLE IF EXISTS npc_templates;',
    'DROP TABLE IF EXISTS users;',
    'DROP TABLE IF EXISTS zones;',
    'DROP TABLE IF EXISTS shop_templates;',
    'DROP TABLE IF EXISTS character_inventory;',
    'DROP TABLE IF EXISTS character_equipment;',
    'DROP TABLE IF EXISTS status_templates;',
    'DROP TABLE IF EXISTS npc_status;',
    'SET FOREIGN_KEY_CHECKS = 1;'
  ];

  const connection = await pool.getConnection();
  try {
    for (const query of dropTableQueries) {
      await connection.query(query);
    }
    console.log('All tables dropped.');
  } catch (err) {
    console.error('Error dropping tables', err);
  } finally {
    connection.release();
  }

  // Initialize tables
  await initTables();

  return pool;
}

module.exports = { resetDatabase };
