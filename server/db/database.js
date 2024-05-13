// db/database.js
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./mud.db', (err) => {
    if (err) {
        console.error('Could not connect to database', err);
        return;
    }
    console.log('Connected to the MUD SQLite database.');
    initTables();
});

function initTables() {
  const tableCreationScripts = [
      `CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS zones (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT
      )`,
      `CREATE TABLE IF NOT EXISTS zone_connections (
          zone_id INTEGER,
          connected_zone_id INTEGER,
          connection_type TEXT,
          FOREIGN KEY (zone_id) REFERENCES zones(id),
          FOREIGN KEY (connected_zone_id) REFERENCES zones(id)
      )`,
      `CREATE TABLE IF NOT EXISTS npc_templates (
        npc_template_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        behavior_type TEXT,
        base_stats TEXT
      )`,
      `CREATE TABLE IF NOT EXISTS object_templates (
        object_template_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        is_collectible BOOLEAN,
        item_template_id INTEGER,
        FOREIGN KEY (item_template_id) REFERENCES item_templates(item_template_id)
      )`,
      `CREATE TABLE IF NOT EXISTS item_templates (
        item_template_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        item_type TEXT,
        is_equipment BOOLEAN DEFAULT 0,
        equipment_type TEXT,
        slot TEXT,
        stats TEXT,
        is_collectible BOOLEAN DEFAULT 1,
        use_effect TEXT
      )`,
      `CREATE TABLE IF NOT EXISTS npc_instances (
        npc_instance_id INTEGER PRIMARY KEY AUTOINCREMENT,
        npc_template_id INTEGER,
        current_zone_id INTEGER,
        base_stats TEXT,
        current_stats TEXT,
        state TEXT,
        FOREIGN KEY (npc_template_id) REFERENCES npc_templates(npc_template_id),
        FOREIGN KEY (current_zone_id) REFERENCES zones(id)
      )`,
      `CREATE TABLE IF NOT EXISTS object_instances (
          object_instance_id INTEGER PRIMARY KEY AUTOINCREMENT,
          object_template_id INTEGER,
          current_zone_id INTEGER,
          state TEXT,
          FOREIGN KEY (object_template_id) REFERENCES object_templates(object_template_id),
          FOREIGN KEY (current_zone_id) REFERENCES zones(id)
      )`,
      `CREATE TABLE IF NOT EXISTS item_instances (
          item_instance_id INTEGER PRIMARY KEY AUTOINCREMENT,
          item_template_id INTEGER,
          owner_id INTEGER,
          quantity INTEGER DEFAULT 1,
          condition TEXT,
          FOREIGN KEY (item_template_id) REFERENCES item_templates(item_template_id),
          FOREIGN KEY (owner_id) REFERENCES characters(character_id)
      )`,
      `CREATE TABLE IF NOT EXISTS characters (
        character_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        class TEXT,
        base_stats TEXT,
        current_stats TEXT,
        current_zone_id INTEGER,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (current_zone_id) REFERENCES zones(id)
      )`
  ];

  tableCreationScripts.forEach(script => {
    db.run(script, (err) => {
      if (err) {
        console.error("Error creating tables", err);
      }
    });
  });
}


module.exports = db;
