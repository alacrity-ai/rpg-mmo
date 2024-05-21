const zoneTemplates = [
    {
      name: 'Enchanted Forest',
      description: 'A mystical forest filled with magical creatures and hidden secrets.',
      hostile_npcs: JSON.stringify([
        { npc_id: 1, chance_to_spawn: 0.3, max_instances: 5 }, // Example: Rat
        { npc_id: 2, chance_to_spawn: 0.1, max_instances: 2 }  // Example: Donkey
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
      name: 'Abandoned Mine',
      description: 'A dark and eerie mine, once bustling with activity, now overrun by creatures.',
      hostile_npcs: JSON.stringify([
        { npc_id: 1, chance_to_spawn: 0.4, max_instances: 10 }, // Example: Rat
      ]),
      friendly_npcs: JSON.stringify([]),
      image_folder_path: 'assets/images/zones/abandoned-mine',
      min_areas: 2,
      max_areas: 5,
      music_key: 'mine_music1'
    }
  ];
  
  module.exports = zoneTemplates;
  