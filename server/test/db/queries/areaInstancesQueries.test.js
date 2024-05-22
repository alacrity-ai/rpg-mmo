// test/db/queries/AreaInstances.test.js
const { resetDatabase } = require('../../../db/utils/dbHelpers');
const { createAreaInstance, getAreaInstanceById, getAllAreaInstances, getEncounterByAreaInstanceId, getFriendlyNPCsByAreaInstanceId } = require('../../../db/queries/areaInstancesQueries');
const AreaInstance = require('../../../models/AreaInstance');

describe('AreaInstance Queries', () => {
  let pool;

  beforeAll(async () => {
    pool = await resetDatabase();

    // Insert necessary encounter templates to satisfy foreign key constraints
    const sqlInsertEncounterTemplate = 'INSERT INTO encounter_templates (name, enemies, is_boss) VALUES (?, ?, ?)';
    const encounterTemplates = [
      ['Goblin Ambush', JSON.stringify([{ npc_template_id: 1, position: 0 }, { npc_template_id: 1, position: 1 }, { npc_template_id: 2, position: 2 }]), false],
      ['Dragon Lair', JSON.stringify([{ npc_template_id: 3, position: 0 }, { npc_template_id: 4, position: 1 }]), true]
    ];

    for (const params of encounterTemplates) {
      await pool.execute(sqlInsertEncounterTemplate, params);
    }
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('createAreaInstance', () => {
    it('should create a new area instance', async () => {
      const params = {
        background_image: 'forest.png',
        encounter: 1, // Assuming the first inserted encounter template has ID 1
        friendlyNpcs: { 201: 1 }
      };
      const areaInstance = await createAreaInstance(params);

      expect(areaInstance).toBeInstanceOf(AreaInstance);
      expect(areaInstance.backgroundImage).toBe(params.background_image);
      expect(areaInstance.encounter).toBe(params.encounter);
      expect(areaInstance.friendlyNpcs).toEqual(params.friendlyNpcs);
    });
  });

  describe('getAreaInstanceById', () => {
    it('should retrieve an area instance by ID', async () => {
      const params = {
        background_image: 'cave.png',
        encounter: 2, // Assuming the second inserted encounter template has ID 2
        friendlyNpcs: { 202: 2 }
      };
      const createdAreaInstance = await createAreaInstance(params);
      const retrievedAreaInstance = await getAreaInstanceById(createdAreaInstance.id);

      expect(retrievedAreaInstance).toBeInstanceOf(AreaInstance);
      expect(retrievedAreaInstance.id).toBe(createdAreaInstance.id);
      expect(retrievedAreaInstance.backgroundImage).toBe(params.background_image);
      expect(retrievedAreaInstance.encounter).toBe(params.encounter);
      expect(retrievedAreaInstance.friendlyNpcs).toEqual(params.friendlyNpcs);
    });
  });

  describe('getAllAreaInstances', () => {
    it('should retrieve all area instances', async () => {
      const params1 = {
        background_image: 'forest.png',
        encounter: 1, // Assuming the first inserted encounter template has ID 1
        friendlyNpcs: { 201: 1 }
      };
      const params2 = {
        background_image: 'desert.png',
        encounter: 2, // Assuming the second inserted encounter template has ID 2
        friendlyNpcs: { 202: 2 }
      };
      await createAreaInstance(params1);
      await createAreaInstance(params2);

      const areaInstances = await getAllAreaInstances();

      expect(areaInstances.length).toBeGreaterThanOrEqual(2);
      expect(areaInstances[0]).toBeInstanceOf(AreaInstance);
    });
  });

  describe('getEncounterByAreaInstanceId', () => {
    it('should retrieve the encounter by area instance ID', async () => {
      const params = {
        background_image: 'forest.png',
        encounter: 1, // Assuming the first inserted encounter template has ID 1
        friendlyNpcs: { 201: 1 }
      };
      const createdAreaInstance = await createAreaInstance(params);
      const encounter = await getEncounterByAreaInstanceId(createdAreaInstance.id);

      expect(encounter).toBe(params.encounter);
    });
  });

  describe('getFriendlyNPCsByAreaInstanceId', () => {
    it('should retrieve the friendly NPCs by area instance ID', async () => {
      const params = {
        background_image: 'forest.png',
        encounter: 1, // Assuming the first inserted encounter template has ID 1
        friendlyNpcs: { 201: 1 }
      };
      const createdAreaInstance = await createAreaInstance(params);
      const friendlyNpcs = await getFriendlyNPCsByAreaInstanceId(createdAreaInstance.id);

      expect(friendlyNpcs).toEqual(params.friendlyNpcs);
    });
  });
});
