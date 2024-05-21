const npcTemplates = [
  {
    name: 'Rat',
    sprite_key: 'rat_sprite',
    description: 'A small, skittish rodent.',
    script_path: 'scripts/rat_behavior.js',
    base_stats: JSON.stringify({
      strength: 3,
      agility: 5,
      health: 20
    }),
    loot_table: JSON.stringify([
      { item_id: 1, chance_to_drop: 0.5 },  // Health Potion with 50% chance
      { item_id: 7, chance_to_drop: 0.1 }   // Leather Boots with 10% chance
    ])
  },
  {
    name: 'Donkey',
    sprite_key: 'donkey_sprite',
    description: 'A sturdy, reliable donkey.',
    script_path: 'scripts/donkey_behavior.js',
    base_stats: JSON.stringify({
      strength: 8,
      agility: 2,
      health: 50
    }),
    loot_table: JSON.stringify([
      { item_id: 2, chance_to_drop: 0.4 },  // Mana Potion with 40% chance
      { item_id: 8, chance_to_drop: 0.2 }   // Ring of Strength with 20% chance
    ])
  }
];

module.exports = npcTemplates;
