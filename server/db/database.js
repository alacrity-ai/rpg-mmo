// db/database.js
require('dotenv').config();
const mysql = require('mysql2/promise');

console.log(`Connecting to database host: ${process.env.DB_HOST}, with user: ${process.env.DB_USER}`)

// Create a connection pool to the database
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function initTables() {
  const tableCreationScripts = [
    `CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS encounter_templates (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      enemies JSON,
      is_boss BOOLEAN DEFAULT 0
    )`,
    `CREATE TABLE IF NOT EXISTS zone_templates (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      encounters JSON,
      friendly_npcs JSON,
      image_folder_path VARCHAR(255),
      min_areas INT,
      max_areas INT,
      music_key VARCHAR(255)
    )`,
    `CREATE TABLE IF NOT EXISTS zone_instances (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      template_id INT,
      areas JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (template_id) REFERENCES zone_templates(id)
    )`,
    `CREATE TABLE IF NOT EXISTS area_instances (
      id INT AUTO_INCREMENT PRIMARY KEY,
      background_image VARCHAR(255),
      encounter INT DEFAULT NULL,
      friendly_npcs JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (encounter) REFERENCES encounter_templates(id)
    )`,
    `CREATE TABLE IF NOT EXISTS item_templates (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      item_type VARCHAR(255),
      is_equipment BOOLEAN DEFAULT 0,
      equipment_type ENUM(
        'off-hand',
        'one-hand',
        'main-hand',
        'two-hand',
        'ammo',
        'head',
        'chest',
        'hands',
        'waist',
        'feet',
        'ring',
        'neck'
      ),
      icon_key VARCHAR(255),
      classes VARCHAR(255),
      stats JSON,
      is_collectible BOOLEAN DEFAULT 1,
      use_effect JSON
    )`,
    `CREATE TABLE IF NOT EXISTS npc_dialogue_templates (
      id INT AUTO_INCREMENT PRIMARY KEY,
      description TEXT NOT NULL,
      script_path VARCHAR(255) NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS npc_templates (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      sprite_key VARCHAR(255),
      description TEXT,
      script_path VARCHAR(255),
      base_stats JSON,
      loot_table JSON,
      npc_dialogue_template_id INT,
      FOREIGN KEY (npc_dialogue_template_id) REFERENCES npc_dialogue_templates(id)
    )`,
    `CREATE TABLE IF NOT EXISTS npc_instances (
      id INT AUTO_INCREMENT PRIMARY KEY,
      npc_template_id INT,
      current_area_id INT,
      base_stats JSON,
      current_stats JSON,
      state TEXT,
      FOREIGN KEY (npc_template_id) REFERENCES npc_templates(id),
      FOREIGN KEY (current_area_id) REFERENCES area_instances(id)
    )`,
    `CREATE TABLE IF NOT EXISTS npc_status (
      id INT AUTO_INCREMENT PRIMARY KEY,
      npc_instance_id INT NOT NULL,
      statuses JSON NOT NULL,
      FOREIGN KEY (npc_instance_id) REFERENCES npc_instances(id)
    )`,
    `CREATE TABLE IF NOT EXISTS class_templates (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      base_stats JSON NOT NULL,
      stat_level_scaling JSON NOT NULL,
      description TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS characters (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      name VARCHAR(255) NOT NULL,
      class ENUM(
        'rogue',
        'monk',
        'ranger',
        'reaver',
        'paladin',
        'warrior',
        'shaman',
        'priest',
        'druid',
        'arcanist',
        'elementalist',
        'necromancer'
      ) NOT NULL,
      base_stats JSON,
      current_stats JSON,
      current_area_id INT,
      flags TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (current_area_id) REFERENCES area_instances(id)
    )`,
    `CREATE TABLE IF NOT EXISTS npc_dialogue_instances (
      id INT AUTO_INCREMENT PRIMARY KEY,
      npc_dialogue_template_id INT NOT NULL,
      character_id INT NOT NULL,
      state INT DEFAULT 0,
      FOREIGN KEY (npc_dialogue_template_id) REFERENCES npc_dialogue_templates(id),
      FOREIGN KEY (character_id) REFERENCES characters(id)
    )`,
    `CREATE TABLE IF NOT EXISTS character_flag_templates (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS character_parties (
      id INT AUTO_INCREMENT PRIMARY KEY,
      party_members JSON NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS character_inventory (
      id INT AUTO_INCREMENT PRIMARY KEY,
      character_id INT NOT NULL,
      inventory_slots VARCHAR(255) DEFAULT '0,0,0,0,0,0,0,0,0,0',
      gold INT DEFAULT 0,
      FOREIGN KEY (character_id) REFERENCES characters(id)
    )`,
    `CREATE TABLE IF NOT EXISTS character_equipment (
      id INT AUTO_INCREMENT PRIMARY KEY,
      character_id INT NOT NULL,
      main_hand INT DEFAULT NULL,
      off_hand INT DEFAULT NULL,
      two_hand INT DEFAULT NULL,
      ammo INT DEFAULT NULL,
      head INT DEFAULT NULL,
      chest INT DEFAULT NULL,
      hands INT DEFAULT NULL,
      waist INT DEFAULT NULL,
      feet INT DEFAULT NULL,
      ring1 INT DEFAULT NULL,
      ring2 INT DEFAULT NULL,
      neck INT DEFAULT NULL,
      FOREIGN KEY (character_id) REFERENCES characters(id)
    )`,
    `CREATE TABLE IF NOT EXISTS character_status (
      id INT AUTO_INCREMENT PRIMARY KEY,
      character_id INT NOT NULL,
      statuses JSON NOT NULL,
      FOREIGN KEY (character_id) REFERENCES characters(id)
    )`,
    `CREATE TABLE IF NOT EXISTS status_templates (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      effect_type ENUM('buff', 'debuff') NOT NULL,
      effect_details JSON NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS shop_templates (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      inventory JSON NOT NULL
    )`
  ];

  const connection = await pool.getConnection();
  try {
    for (const script of tableCreationScripts) {
      await connection.query(script);
    }
    console.log('Tables initialized.');
  } catch (err) {
    console.error('Error creating tables', err);
  } finally {
    connection.release();
  }
}

async function query(sql, params) {
  const connection = await pool.getConnection();
  try {
    const [results] = await connection.execute(sql, params);
    return results;
  } catch (err) {
    console.error('Database query error:', err);
    throw err;
  } finally {
    connection.release();
  }
}

module.exports = { pool, initTables, query };
