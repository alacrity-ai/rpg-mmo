// db/data/npcTemplates.js

const npcTemplates = [
  {
    name: 'Rat',
    sprite_key: 'rat_sprite',
    description: 'A small, skittish rodent.',
    script_path: 'scripts/rat_behavior.js',
    base_stats: JSON.stringify({
      health: 20,
      mana: 0,
      strength: 3,
      stamina: 5,
      intelligence: 1
    }),
    loot_table: JSON.stringify([
      { item_id: 1, chance_to_drop: 0.5 },  // Health Potion with 50% chance
      { item_id: 7, chance_to_drop: 0.1 }   // Leather Boots with 10% chance
    ]),
    npc_dialogue_template_id: null
  },
  {
    name: 'Donkey',
    sprite_key: 'donkey_sprite',
    description: 'A sturdy, reliable donkey.',
    script_path: 'scripts/donkey_behavior.js',
    base_stats: JSON.stringify({
      health: 50,
      mana: 0,
      strength: 8,
      stamina: 7,
      intelligence: 2
    }),
    loot_table: JSON.stringify([
      { item_id: 2, chance_to_drop: 0.4 },  // Mana Potion with 40% chance
      { item_id: 8, chance_to_drop: 0.2 }   // Ring of Strength with 20% chance
    ]),
    npc_dialogue_template_id: null
  }
];

module.exports = npcTemplates;
