require('dotenv').config();
const { pool } = require('./database');
const areaEventTemplates = require('./data/areaEventTemplates');
const itemTemplates = require('./data/itemTemplates');
const npcTemplates = require('./data/npcTemplates');
const classTemplates = require('./data/classTemplates');
const shopTemplates = require('./data/shopTemplates');
const statusTemplates = require('./data/statusTemplates')
const zoneTemplates = require('./data/zoneTemplates');
const encounterTemplates = require('./data/encounterTemplates');
const npcDialogueTemplates = require('./data/npcDialogueTemplates');
const logger = require('../utilities/logger');


async function populateNpcDialogueTemplates() {
  const connection = await pool.getConnection();
  try {
    for (const dialogue of npcDialogueTemplates) {
      const [rows] = await connection.query(
        `SELECT * FROM npc_dialogue_templates WHERE description = ?`,
        [dialogue.description]
      );

      if (rows.length === 0) {
        await connection.query(
          `INSERT INTO npc_dialogue_templates (description, script_path)
          VALUES (?, ?)`,
          [
            dialogue.description,
            dialogue.script_path
          ]
        );
      }
    }
    logger.info('NPC dialogue templates populated.');
  } catch (err) {
    logger.error('Error populating NPC dialogue templates', err);
  } finally {
    connection.release();
  }
}

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
    logger.info('Encounter templates populated.');
  } catch (err) {
    logger.error('Error populating encounter templates', err);
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
          `INSERT INTO zone_templates (name, scene_key, description, type, encounters, friendly_npcs, image_folder_path, min_areas, max_areas, area_events, music_path, ambient_sound_path, environment_effects)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            zone.name,
            zone.scene_key,
            zone.description,
            zone.type,
            JSON.stringify(zone.encounters),
            JSON.stringify(zone.friendly_npcs),
            zone.image_folder_path,
            zone.min_areas,
            zone.max_areas,
            JSON.stringify(zone.area_events),
            zone.music_path,
            zone.ambient_sound_path,
            JSON.stringify(zone.environment_effects)
          ]
        );
      }
    }
    logger.info('Zone templates populated.');
  } catch (err) {
    logger.error('Error populating zone templates', err);
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
          `INSERT INTO item_templates (name, description, item_type, is_equipment, equipment_type, icon_key, classes, stats, is_collectible, use_effect)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            item.name,
            item.description,
            item.item_type,
            item.is_equipment,
            item.equipment_type,
            item.icon_key,
            JSON.stringify(item.classes), // Ensure classes are stored as JSON
            JSON.stringify(item.stats), // Ensure stats are stored as JSON
            item.is_collectible,
            JSON.stringify(item.use_effect) // Ensure use_effect is stored as JSON
          ]
        );
      }
    }
    logger.info('Item templates populated.');
  } catch (err) {
    logger.error('Error populating item templates', err);
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
          `INSERT INTO npc_templates (name, sprite_key, description, script_path, base_stats, loot_table, npc_dialogue_template_id)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            npc.name,
            npc.sprite_key,
            npc.description,
            npc.script_path,
            npc.base_stats,
            npc.loot_table,
            npc.npc_dialogue_template_id
          ]
        );
      }
    }
    logger.info('NPC templates populated.');
  } catch (err) {
    logger.error('Error populating NPC templates', err);
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
    logger.info('Class templates populated.');
  } catch (err) {
    logger.error('Error populating class templates', err);
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
    logger.info('Shop templates populated.');
  } catch (err) {
    logger.error('Error populating shop templates', err);
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
      logger.info('Status effect templates populated.');
    } catch (err) {
      logger.error('Error populating status effect templates', err);
    } finally {
      connection.release();
    }
}

async function populateAreaEventTemplates() {
  const connection = await pool.getConnection();
  try {
    for (const event of areaEventTemplates) {
      const [rows] = await connection.query(
        `SELECT * FROM area_event_templates WHERE id = ?`,
        [event.id]
      );

      if (rows.length === 0) {
        await connection.query(
          `INSERT INTO area_event_templates (id, name, event_script)
          VALUES (?, ?, ?)`,
          [
            event.id,
            event.name,
            event.event_script
          ]
        );
      }
    }
    logger.info('Area event templates populated.');
  } catch (err) {
    logger.error('Error populating area event templates', err);
  } finally {
    connection.release();
  }
}

async function populateTables() {
  await populateAreaEventTemplates();
  await populateNpcDialogueTemplates();
  await populateEncounterTemplates();
  await populateItemTemplates();
  await populateNpcTemplates();
  await populateZoneTemplates();
  await populateClassTemplates();
  await populateShopTemplates();
  await populateStatusTemplates();
  logger.info('All tables populated.');
}

module.exports = { populateTables };
