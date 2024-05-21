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
    })
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
    })
  }
];

module.exports = npcTemplates;
