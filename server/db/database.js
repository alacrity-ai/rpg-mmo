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
      npc_template_id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      sprite_key VARCHAR(255),
      description TEXT,
      script_path VARCHAR(255),
      base_stats TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS item_templates (
      item_template_id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      item_type VARCHAR(255),
      is_equipment BOOLEAN DEFAULT 0,
      equipment_type VARCHAR(255),
      icon_key VARCHAR(255),
      stats TEXT,
      is_collectible BOOLEAN DEFAULT 1,
      use_effect TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS npc_instances (
      npc_instance_id INT AUTO_INCREMENT PRIMARY KEY,
      npc_template_id INT,
      current_zone_id INT,
      base_stats TEXT,
      current_stats TEXT,
      state TEXT,
      FOREIGN KEY (npc_template_id) REFERENCES npc_templates(npc_template_id),
      FOREIGN KEY (current_zone_id) REFERENCES zones(id)
    )`,
    `CREATE TABLE IF NOT EXISTS characters (
      character_id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      name VARCHAR(255) NOT NULL,
      class VARCHAR(255),
      base_stats TEXT,
      current_stats TEXT,
      current_zone_id INT,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (current_zone_id) REFERENCES zones(id)
    )`,
    `CREATE TABLE IF NOT EXISTS item_instances (
      item_instance_id INT AUTO_INCREMENT PRIMARY KEY,
      item_template_id INT,
      owner_id INT,
      quantity INT DEFAULT 1,
      FOREIGN KEY (item_template_id) REFERENCES item_templates(item_template_id),
      FOREIGN KEY (owner_id) REFERENCES characters(character_id)
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
