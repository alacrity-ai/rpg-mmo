// db/database.js
require('dotenv').config();
const mysql = require('mysql2/promise');

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
    `CREATE TABLE IF NOT EXISTS zones (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS npc_templates (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      sprite_key VARCHAR(255),
      description TEXT,
      script_path VARCHAR(255),
      base_stats TEXT
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
      stats TEXT,
      is_collectible BOOLEAN DEFAULT 1,
      use_effect TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS npc_instances (
      id INT AUTO_INCREMENT PRIMARY KEY,
      npc_template_id INT,
      current_zone_id INT,
      base_stats TEXT,
      current_stats TEXT,
      state TEXT,
      FOREIGN KEY (npc_template_id) REFERENCES npc_templates(id),
      FOREIGN KEY (current_zone_id) REFERENCES zones(id)
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
      base_stats TEXT,
      current_stats TEXT,
      current_zone_id INT,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (current_zone_id) REFERENCES zones(id)
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
