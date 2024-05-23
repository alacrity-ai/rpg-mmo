// test/models/ZoneTemplate.test.js

const ZoneTemplate = require('../../models/ZoneTemplate');

describe('ZoneTemplate', () => {
  it('should create an instance of ZoneTemplate with correct properties', () => {
    const zoneTemplate = new ZoneTemplate({
      id: 1,
      name: 'Enchanted Forest',
      description: 'A mystical forest filled with magical creatures and hidden secrets.',
      encounters: [
        { encounter_id: 1, probability: 0.5 },
        { encounter_id: 2, probability: 0.1 }
      ],
      friendly_npcs: [
        { npc_id: 2, chance_to_spawn: 0.5, max_instances: 1 }
      ],
      image_folder_path: 'assets/images/zones/enchanted-forest',
      min_areas: 3,
      max_areas: 7,
      area_events: [
        { template_id: 1, probability: 0.2, max_instances: 2 },
        { template_id: 2, probability: 0.1, max_instances: 1 }
      ],
      music_key: 'forest_music1'
    });

    expect(zoneTemplate.id).toBe(1);
    expect(zoneTemplate.name).toBe('Enchanted Forest');
    expect(zoneTemplate.description).toBe('A mystical forest filled with magical creatures and hidden secrets.');
    expect(zoneTemplate.encounters).toEqual([
      { encounter_id: 1, probability: 0.5 },
      { encounter_id: 2, probability: 0.1 }
    ]);
    expect(zoneTemplate.friendlyNpcs).toEqual([
      { npc_id: 2, chance_to_spawn: 0.5, max_instances: 1 }
    ]);
    expect(zoneTemplate.imageFolderPath).toBe('assets/images/zones/enchanted-forest');
    expect(zoneTemplate.minAreas).toBe(3);
    expect(zoneTemplate.maxAreas).toBe(7);
    expect(zoneTemplate.areaEvents).toEqual([
      { template_id: 1, probability: 0.2, max_instances: 2 },
      { template_id: 2, probability: 0.1, max_instances: 1 }
    ]);
    expect(zoneTemplate.musicKey).toBe('forest_music1');
  });

  it('should handle missing optional properties correctly', () => {
    const zoneTemplate = new ZoneTemplate({
      id: 2,
      name: 'Desert Wasteland',
      description: 'A barren wasteland with dangerous creatures lurking around.',
      encounters: [],
      friendly_npcs: [],
      image_folder_path: 'assets/images/zones/desert-wasteland',
      min_areas: 1,
      max_areas: 5,
      area_events: [],
      music_key: 'desert_music1'
    });

    expect(zoneTemplate.id).toBe(2);
    expect(zoneTemplate.name).toBe('Desert Wasteland');
    expect(zoneTemplate.description).toBe('A barren wasteland with dangerous creatures lurking around.');
    expect(zoneTemplate.encounters).toEqual([]);
    expect(zoneTemplate.friendlyNpcs).toEqual([]);
    expect(zoneTemplate.imageFolderPath).toBe('assets/images/zones/desert-wasteland');
    expect(zoneTemplate.minAreas).toBe(1);
    expect(zoneTemplate.maxAreas).toBe(5);
    expect(zoneTemplate.areaEvents).toEqual([]);
    expect(zoneTemplate.musicKey).toBe('desert_music1');
  });
});
