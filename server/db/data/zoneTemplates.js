const zoneTemplates = [
  {
    name: "Elder's Wood",
    scene_key: "EldersWood",
    description: 'A mystical forest filled with magical creatures and hidden secrets.',
    type: 'normal',
    encounters: [
      { encounter_name: "Forest Ambush", probability: 0.8 },
    ],
    friendly_npcs: [
      { npc_id: 2, chance_to_spawn: 0.5, max_instances: 1 }  // Example: Donkey
    ],
    area_events: [
      { template_id: 1, probability: 0.2, max_instances: 2 },
      { template_id: 2, probability: 0.1, max_instances: 1 }
    ],
    image_folder_path: 'assets/images/zone/area/normal/elderswood',
    music_path: 'assets/music/zones/elderswood.mp3',
    ambient_sound_path: null,
    min_areas: 3,
    max_areas: 7,
    environment_effects: {
      fog: {
        intensity: 0.5,
        speed: 0.6
      }
    }
  }
];

module.exports = zoneTemplates;
