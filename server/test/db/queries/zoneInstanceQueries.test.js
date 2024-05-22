// test/db/queries/ZoneInstances.test.js
const { resetDatabase } = require('../../../db/utils/dbHelpers');
const { createZoneInstance, getZoneInstanceById, getAllZoneInstances } = require('../../../db/queries/zoneInstancesQueries');
const ZoneInstance = require('../../../models/ZoneInstance');

describe('ZoneInstance Queries', () => {
  let pool;

  beforeAll(async () => {
    pool = await resetDatabase();

    // Insert necessary zone templates to satisfy foreign key constraints
    const sqlInsertTemplate = 'INSERT INTO zone_templates (name, description, encounters, friendly_npcs, image_folder_path, min_areas, max_areas, music_key) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const templates = [
      ['Forest Template', 'Template for forest zones.', JSON.stringify([{ encounter_id: 1, probability: 0.5 }]), JSON.stringify([{ npc_id: 2, chance_to_spawn: 0.5, max_instances: 1 }]), 'assets/images/zones/forest-template', 3, 7, 'forest_music'],
      ['Cave Template', 'Template for cave zones.', JSON.stringify([{ encounter_id: 2, probability: 0.3 }]), JSON.stringify([{ npc_id: 3, chance_to_spawn: 0.2, max_instances: 2 }]), 'assets/images/zones/cave-template', 2, 5, 'cave_music']
    ];

    for (const params of templates) {
      await pool.execute(sqlInsertTemplate, params);
    }
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('createZoneInstance', () => {
    it('should create a new zone instance', async () => {
      const params = {
        name: 'Forest Zone',
        template_id: 1, // Assuming the first inserted template has ID 1
        areas: {
          1: { north: 2, south: null, east: 3, west: null, type: 'entrance' },
          2: { north: null, south: 1, east: 4, west: null, type: 'area' },
          3: { north: 4, south: null, east: null, west: 1, type: 'area' },
          4: { north: null, south: 3, east: null, west: 2, type: 'exit' }
        }
      };
      const zoneInstance = await createZoneInstance(params);

      expect(zoneInstance).toBeInstanceOf(ZoneInstance);
      expect(zoneInstance.name).toBe(params.name);
      expect(zoneInstance.templateId).toBe(params.template_id);
      expect(zoneInstance.areas).toEqual(params.areas);
    });
  });

  describe('getZoneInstanceById', () => {
    it('should retrieve a zone instance by ID', async () => {
      const params = {
        name: 'Mystic Cave Zone',
        template_id: 2, // Assuming the second inserted template has ID 2
        areas: {
          1: { north: 2, south: null, east: 3, west: null, type: 'entrance' },
          2: { north: null, south: 1, east: 4, west: null, type: 'area' },
          3: { north: 4, south: null, east: null, west: 1, type: 'area' },
          4: { north: null, south: 3, east: null, west: 2, type: 'exit' }
        }
      };
      const createdZoneInstance = await createZoneInstance(params);
      const retrievedZoneInstance = await getZoneInstanceById(createdZoneInstance.id);

      expect(retrievedZoneInstance).toBeInstanceOf(ZoneInstance);
      expect(retrievedZoneInstance.id).toBe(createdZoneInstance.id);
      expect(retrievedZoneInstance.name).toBe(params.name);
      expect(retrievedZoneInstance.templateId).toBe(params.template_id);
      expect(retrievedZoneInstance.areas).toEqual(params.areas);
    });
  });

  describe('getAllZoneInstances', () => {
    it('should retrieve all zone instances', async () => {
      const params1 = {
        name: 'Enchanted Forest Zone',
        template_id: 1, // Assuming the first inserted template has ID 1
        areas: {
          1: { north: 2, south: null, east: 3, west: null, type: 'entrance' },
          2: { north: null, south: 1, east: 4, west: null, type: 'area' },
          3: { north: 4, south: null, east: null, west: 1, type: 'area' },
          4: { north: null, south: 3, east: null, west: 2, type: 'exit' }
        }
      };
      const params2 = {
        name: 'Burning Desert Zone',
        template_id: 2, // Assuming the second inserted template has ID 2
        areas: {
          1: { north: 2, south: null, east: 3, west: null, type: 'entrance' },
          2: { north: null, south: 1, east: 4, west: null, type: 'area' },
          3: { north: 4, south: null, east: null, west: 1, type: 'area' },
          4: { north: null, south: 3, east: null, west: 2, type: 'exit' }
        }
      };
      await createZoneInstance(params1);
      await createZoneInstance(params2);

      const zoneInstances = await getAllZoneInstances();

      expect(zoneInstances.length).toBeGreaterThanOrEqual(2);
      expect(zoneInstances[0]).toBeInstanceOf(ZoneInstance);
    });
  });
});
