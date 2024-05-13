const npcTemplates = [
    {
      name: 'Rat',
      description: 'A small, skittish rodent.',
      behavior_type: 'hostile',
      base_stats: JSON.stringify({
        strength: 3,
        agility: 5,
        health: 20
      })
    },
    {
      name: 'Donkey',
      description: 'A sturdy, reliable donkey.',
      behavior_type: 'passive',
      base_stats: JSON.stringify({
        strength: 8,
        agility: 2,
        health: 50
      })
    }
  ];
  
  module.exports = npcTemplates;
  