require('dotenv').config();
const { pool } = require('./database');
const itemTemplates = require('./data/itemTemplates');
const npcTemplates = require('./data/npcTemplates');
const classTemplates = require('./data/classTemplates');
const shopTemplates = require('./data/shopTemplates');
const statusTemplates = require('./data/statusTemplates')
const zoneTemplates = require('./data/zoneTemplates');
const encounterTemplates = require('./data/encounterTemplates');


async function populateEncounterTemplates() {
  const connection = await pool.getConnection();
  try {
    for (const encounter of encounterTemplates) {
      const [rows] = await connection.query(
        `SELECT * FROM encounter_templates WHERE name = ?`,
        [encounter.name]
      );

      if (rows.length === 0) {
        await connection.query(
          `INSERT INTO encounter_templates (name, enemies, is_boss)
          VALUES (?, ?, ?)`,
          [
            encounter.name,
            encounter.enemies,
            encounter.is_boss
          ]
        );
      }
    }
    console.log('Encounter templates populated.');
  } catch (err) {
    console.error('Error populating encounter templates', err);
  } finally {
    connection.release();
  }
}

async function populateZoneTemplates() {
  const connection = await pool.getConnection();
  try {
    for (const zone of zoneTemplates) {
      const [rows] = await connection.query(
        `SELECT * FROM zone_templates WHERE name = ?`,
        [zone.name]
      );

      if (rows.length === 0) {
        await connection.query(
          `INSERT INTO zone_templates (name, description, encounters, friendly_npcs, image_folder_path, min_areas, max_areas, music_key)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            zone.name,
            zone.description,
            zone.encounters,
            zone.friendly_npcs,
            zone.image_folder_path,
            zone.min_areas,
            zone.max_areas,
            zone.music_key
          ]
        );
      }
    }
    console.log('Zone templates populated.');
  } catch (err) {
    console.error('Error populating zone templates', err);
  } finally {
    connection.release();
  }
}

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
          `INSERT INTO npc_templates (name, sprite_key, description, script_path, base_stats, loot_table)
          VALUES (?, ?, ?, ?, ?, ?)`,
          [
            npc.name,
            npc.sprite_key,
            npc.description,
            npc.script_path,
            npc.base_stats,
            npc.loot_table
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


async function populateClassTemplates() {
  const connection = await pool.getConnection();
  try {
    for (const classTemplate of classTemplates) {
      const [rows] = await connection.query(
        `SELECT * FROM class_templates WHERE name = ?`,
        [classTemplate.name]
      );

      if (rows.length === 0) {
        await connection.query(
          `INSERT INTO class_templates (name, base_stats, stat_level_scaling, description)
          VALUES (?, ?, ?, ?)`,
          [
            classTemplate.name,
            classTemplate.base_stats,
            classTemplate.stat_level_scaling,
            classTemplate.description
          ]
        );
      }
    }
    console.log('Class templates populated.');
  } catch (err) {
    console.error('Error populating class templates', err);
  } finally {
    connection.release();
  }
}

async function populateShopTemplates() {
  const connection = await pool.getConnection();
  try {
    for (const shop of shopTemplates) {
      const [rows] = await connection.query(
        `SELECT * FROM shop_templates WHERE name = ?`,
        [shop.name]
      );

      if (rows.length === 0) {
        await connection.query(
          `INSERT INTO shop_templates (name, inventory)
          VALUES (?, ?)`,
          [
            shop.name,
            shop.inventory
          ]
        );
      }
    }
    console.log('Shop templates populated.');
  } catch (err) {
    console.error('Error populating shop templates', err);
  } finally {
    connection.release();
  }
}

async function populateStatusTemplates() {
    const connection = await pool.getConnection();
    try {
      for (const status of statusTemplates) {
        const [rows] = await connection.query(
          `SELECT * FROM status_templates WHERE name = ?`,
          [status.name]
        );
  
        if (rows.length === 0) {
          await connection.query(
            `INSERT INTO status_templates (name, description, effect_type, effect_details)
            VALUES (?, ?, ?, ?)`,
            [
              status.name,
              status.description,
              status.effect_type,
              status.effect_details
            ]
          );
        }
      }
      console.log('Status effect templates populated.');
    } catch (err) {
      console.error('Error populating status effect templates', err);
    } finally {
      connection.release();
    }
  }

async function populateTables() {
  await populateEncounterTemplates();
  await populateItemTemplates();
  await populateNpcTemplates();
  await populateZoneTemplates();
  await populateClassTemplates();
  await populateShopTemplates();
  await populateStatusTemplates();
  console.log('All tables populated.');
}

module.exports = { populateTables };
