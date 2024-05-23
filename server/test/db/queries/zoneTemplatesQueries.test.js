// test/db/queries/ZoneTemplates.test.js
const { resetDatabase } = require('../../../db/utils/dbHelpers');
const { getZoneTemplateById, getZoneTemplateByName, getAllZoneTemplates, getEncountersByZoneTemplateId, getFriendlyNPCsByZoneTemplateId, getAreaEventsByZoneTemplateId } = require('../../../db/queries/zoneTemplatesQueries');
const ZoneTemplate = require('../../../models/ZoneTemplate');

describe('ZoneTemplate Queries', () => {
  let pool;

  beforeAll(async () => {
    pool = await resetDatabase();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('getZoneTemplateById', () => {
    it('should retrieve a zone template by ID', async () => {
      const sqlInsert = 'INSERT INTO zone_templates (name, description, encounters, friendly_npcs, image_folder_path, min_areas, max_areas, area_events, music_key) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
      const paramsInsert = ['Enchanted Forest', 'A mystical forest.', JSON.stringify([{ encounter_id: 1, probability: 0.5 }]), JSON.stringify([{ npc_id: 2, chance_to_spawn: 0.5, max_instances: 1 }]), 'assets/images/zones/enchanted-forest', 3, 7, JSON.stringify([{ template_id: 1, probability: 0.2, max_instances: 2 }]), 'forest_music1'];
      const [result] = await pool.execute(sqlInsert, paramsInsert);

      const zoneTemplate = await getZoneTemplateById(result.insertId);

      expect(zoneTemplate).toBeInstanceOf(ZoneTemplate);
      expect(zoneTemplate.name).toBe('Enchanted Forest');
      expect(zoneTemplate.description).toBe('A mystical forest.');
      expect(zoneTemplate.areaEvents).toEqual([{ template_id: 1, probability: 0.2, max_instances: 2 }]);
    });
  });

  describe('getZoneTemplateByName', () => {
    it('should retrieve a zone template by name', async () => {
      const sqlInsert = 'INSERT INTO zone_templates (name, description, encounters, friendly_npcs, image_folder_path, min_areas, max_areas, area_events, music_key) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
      const paramsInsert = ['Mystic Cave', 'A dark and mysterious cave.', JSON.stringify([{ encounter_id: 2, probability: 0.3 }]), JSON.stringify([{ npc_id: 3, chance_to_spawn: 0.2, max_instances: 2 }]), 'assets/images/zones/mystic-cave', 2, 5, JSON.stringify([{ template_id: 2, probability: 0.3, max_instances: 1 }]), 'cave_music1'];
      await pool.execute(sqlInsert, paramsInsert);

      const zoneTemplate = await getZoneTemplateByName('Mystic Cave');

      expect(zoneTemplate).toBeInstanceOf(ZoneTemplate);
      expect(zoneTemplate.name).toBe('Mystic Cave');
      expect(zoneTemplate.description).toBe('A dark and mysterious cave.');
      expect(zoneTemplate.areaEvents).toEqual([{ template_id: 2, probability: 0.3, max_instances: 1 }]);
    });
  });

  describe('getAllZoneTemplates', () => {
    it('should retrieve all zone templates', async () => {
      const sqlInsert1 = 'INSERT INTO zone_templates (name, description, encounters, friendly_npcs, image_folder_path, min_areas, max_areas, area_events, music_key) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
      const paramsInsert1 = ['Frozen Tundra', 'A cold and barren tundra.', JSON.stringify([{ encounter_id: 3, probability: 0.4 }]), JSON.stringify([{ npc_id: 4, chance_to_spawn: 0.3, max_instances: 1 }]), 'assets/images/zones/frozen-tundra', 1, 4, JSON.stringify([{ template_id: 3, probability: 0.1, max_instances: 1 }]), 'tundra_music1'];
      const sqlInsert2 = 'INSERT INTO zone_templates (name, description, encounters, friendly_npcs, image_folder_path, min_areas, max_areas, area_events, music_key) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
      const paramsInsert2 = ['Burning Desert', 'A scorching hot desert.', JSON.stringify([{ encounter_id: 4, probability: 0.2 }]), JSON.stringify([{ npc_id: 5, chance_to_spawn: 0.1, max_instances: 3 }]), 'assets/images/zones/burning-desert', 2, 6, JSON.stringify([{ template_id: 4, probability: 0.4, max_instances: 2 }]), 'desert_music1'];
      await pool.execute(sqlInsert1, paramsInsert1);
      await pool.execute(sqlInsert2, paramsInsert2);

      const zoneTemplates = await getAllZoneTemplates();

      expect(zoneTemplates.length).toBeGreaterThanOrEqual(2);
      expect(zoneTemplates[0]).toBeInstanceOf(ZoneTemplate);
    });
  });

  describe('getEncountersByZoneTemplateId', () => {
    it('should retrieve the encounters by zone template ID', async () => {
      const sqlInsert = 'INSERT INTO zone_templates (name, description, encounters, friendly_npcs, image_folder_path, min_areas, max_areas, area_events, music_key) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
      const paramsInsert = ['Haunted Woods', 'A spooky and haunted forest.', JSON.stringify([{ encounter_id: 5, probability: 0.5 }]), JSON.stringify([{ npc_id: 6, chance_to_spawn: 0.4, max_instances: 1 }]), 'assets/images/zones/haunted-woods', 3, 7, JSON.stringify([{ template_id: 5, probability: 0.3, max_instances: 1 }]), 'haunted_music1'];
      const [result] = await pool.execute(sqlInsert, paramsInsert);

      const encounters = await getEncountersByZoneTemplateId(result.insertId);

      expect(encounters).toEqual([{ encounter_id: 5, probability: 0.5 }]);
    });
  });

  describe('getFriendlyNPCsByZoneTemplateId', () => {
    it('should retrieve the friendly NPCs by zone template ID', async () => {
      const sqlInsert = 'INSERT INTO zone_templates (name, description, encounters, friendly_npcs, image_folder_path, min_areas, max_areas, area_events, music_key) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
      const paramsInsert = ['Sacred Grove', 'A serene and sacred grove.', JSON.stringify([{ encounter_id: 6, probability: 0.3 }]), JSON.stringify([{ npc_id: 7, chance_to_spawn: 0.6, max_instances: 2 }]), 'assets/images/zones/sacred-grove', 4, 8, JSON.stringify([{ template_id: 6, probability: 0.5, max_instances: 2 }]), 'grove_music1'];
      const [result] = await pool.execute(sqlInsert, paramsInsert);

      const friendlyNpcs = await getFriendlyNPCsByZoneTemplateId(result.insertId);

      expect(friendlyNpcs).toEqual([{ npc_id: 7, chance_to_spawn: 0.6, max_instances: 2 }]);
    });
  });

  describe('getAreaEventsByZoneTemplateId', () => {
    it('should retrieve the area events by zone template ID', async () => {
      const sqlInsert = 'INSERT INTO zone_templates (name, description, encounters, friendly_npcs, image_folder_path, min_areas, max_areas, area_events, music_key) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
      const paramsInsert = ['Dark Forest', 'A dark and foreboding forest.', JSON.stringify([{ encounter_id: 7, probability: 0.6 }]), JSON.stringify([{ npc_id: 8, chance_to_spawn: 0.5, max_instances: 1 }]), 'assets/images/zones/dark-forest', 5, 9, JSON.stringify([{ template_id: 7, probability: 0.4, max_instances: 3 }]), 'dark_forest_music'];
      const [result] = await pool.execute(sqlInsert, paramsInsert);

      const areaEvents = await getAreaEventsByZoneTemplateId(result.insertId);

      expect(areaEvents).toEqual([{ template_id: 7, probability: 0.4, max_instances: 3 }]);
    });
  });
});
