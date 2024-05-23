// db/data/zoneTemplates.js

const zoneTemplates = [
  {
    name: 'Enchanted Forest',
    description: 'A mystical forest filled with magical creatures and hidden secrets.',
    encounters: JSON.stringify([
      { encounter_id: 1, probability: 0.5 },
      { encounter_id: 2, probability: 1 }
    ]),
    friendly_npcs: JSON.stringify([
      { npc_id: 2, chance_to_spawn: 0.5, max_instances: 1 }  // Example: Donkey
    ]),
    image_folder_path: 'assets/images/zones/enchanted-forest',
    min_areas: 3,
    max_areas: 7,
    music_key: 'forest_music1'
  },
  {
    name: 'Haunted Woods',
    description: 'A forest where the trees whisper and shadows seem to follow you.',
    encounters: JSON.stringify([
      { encounter_id: 1, probability: 0.7 },
      { encounter_id: 2, probability: 0.8 }
    ]),
    friendly_npcs: JSON.stringify([
      { npc_id: 2, chance_to_spawn: 0.3, max_instances: 2 }  // Example: Ghostly Guide
    ]),
    image_folder_path: 'assets/images/zones/haunted-woods',
    min_areas: 5,
    max_areas: 10,
    music_key: 'forest_music2'
  },
  {
    name: 'Dark Forest',
    description: 'A dark and foreboding forest where even the bravest dare not tread.',
    encounters: JSON.stringify([
      { encounter_id: 1, probability: 0.8 },
      { encounter_id: 2, probability: 0.9 }
    ]),
    friendly_npcs: JSON.stringify([
      { npc_id: 2, chance_to_spawn: 0.2, max_instances: 1 }  // Example: Lost Wanderer
    ]),
    image_folder_path: 'assets/images/zones/dark-forest',
    min_areas: 7,
    max_areas: 12,
    music_key: 'forest_music3'
  },
  {
    name: 'Abandoned Mine',
    description: 'A dark and eerie mine, once bustling with activity, now overrun by creatures.',
    encounters: JSON.stringify([
      { encounter_id: 1, probability: 0.4 }
    ]),
    friendly_npcs: JSON.stringify([]),
    image_folder_path: 'assets/images/zones/abandoned-mine',
    min_areas: 2,
    max_areas: 5,
    music_key: 'mine_music1'
  }
];

module.exports = zoneTemplates;
