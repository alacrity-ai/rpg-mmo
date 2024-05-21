const classTemplates = [
    {
      name: 'rogue',
      base_stats: JSON.stringify({
        strength: 5,
        stamina: 3,
        intelligence: 2
      }),
      stat_level_scaling: JSON.stringify({
        strength: 1.2,
        stamina: 1.1,
        intelligence: 1.0
      }),
      description: 'A stealthy and agile fighter, adept at avoiding detection and striking from the shadows.'
    },
    {
      name: 'monk',
      base_stats: JSON.stringify({
        strength: 6,
        stamina: 4,
        intelligence: 3
      }),
      stat_level_scaling: JSON.stringify({
        strength: 1.3,
        stamina: 1.2,
        intelligence: 1.1
      }),
      description: 'A master of martial arts and physical discipline, the monk excels in hand-to-hand combat.'
    },
    {
      name: 'ranger',
      base_stats: JSON.stringify({
        strength: 5,
        stamina: 5,
        intelligence: 3
      }),
      stat_level_scaling: JSON.stringify({
        strength: 1.2,
        stamina: 1.3,
        intelligence: 1.1
      }),
      description: 'A skilled hunter and tracker, the ranger is proficient in both ranged and melee combat.'
    },
    {
      name: 'reaver',
      base_stats: JSON.stringify({
        strength: 7,
        stamina: 6,
        intelligence: 2
      }),
      stat_level_scaling: JSON.stringify({
        strength: 1.4,
        stamina: 1.3,
        intelligence: 0.9
      }),
      description: 'A dark warrior who thrives in chaos and destruction, often wielding cursed or forbidden powers.'
    },
    {
      name: 'paladin',
      base_stats: JSON.stringify({
        strength: 6,
        stamina: 7,
        intelligence: 4
      }),
      stat_level_scaling: JSON.stringify({
        strength: 1.3,
        stamina: 1.4,
        intelligence: 1.2
      }),
      description: 'A holy warrior dedicated to the protection of the weak and the eradication of evil.'
    },
    {
      name: 'warrior',
      base_stats: JSON.stringify({
        strength: 8,
        stamina: 6,
        intelligence: 2
      }),
      stat_level_scaling: JSON.stringify({
        strength: 1.4,
        stamina: 1.3,
        intelligence: 1.0
      }),
      description: 'A battle-hardened soldier who excels in physical combat and tactical warfare.'
    },
    {
      name: 'shaman',
      base_stats: JSON.stringify({
        strength: 4,
        stamina: 5,
        intelligence: 6
      }),
      stat_level_scaling: JSON.stringify({
        strength: 1.1,
        stamina: 1.2,
        intelligence: 1.3
      }),
      description: 'A spiritual guide who draws power from nature and the ancestral spirits.'
    },
    {
      name: 'priest',
      base_stats: JSON.stringify({
        strength: 3,
        stamina: 4,
        intelligence: 7
      }),
      stat_level_scaling: JSON.stringify({
        strength: 1.0,
        stamina: 1.1,
        intelligence: 1.4
      }),
      description: 'A devout healer and protector, the priest uses divine magic to aid allies and smite foes.'
    },
    {
      name: 'druid',
      base_stats: JSON.stringify({
        strength: 4,
        stamina: 6,
        intelligence: 5
      }),
      stat_level_scaling: JSON.stringify({
        strength: 1.1,
        stamina: 1.3,
        intelligence: 1.2
      }),
      description: 'A keeper of the natural world, the druid commands the forces of nature to protect and heal.'
    },
    {
      name: 'arcanist',
      base_stats: JSON.stringify({
        strength: 2,
        stamina: 3,
        intelligence: 8
      }),
      stat_level_scaling: JSON.stringify({
        strength: 0.9,
        stamina: 1.0,
        intelligence: 1.5
      }),
      description: 'A scholar of arcane knowledge, the arcanist wields powerful spells and magical artifacts.'
    },
    {
      name: 'elementalist',
      base_stats: JSON.stringify({
        strength: 3,
        stamina: 4,
        intelligence: 7
      }),
      stat_level_scaling: JSON.stringify({
        strength: 1.0,
        stamina: 1.1,
        intelligence: 1.4
      }),
      description: 'A master of elemental magic, the elementalist controls fire, water, earth, and air in battle.'
    },
    {
      name: 'necromancer',
      base_stats: JSON.stringify({
        strength: 3,
        stamina: 4,
        intelligence: 7
      }),
      stat_level_scaling: JSON.stringify({
        strength: 1.0,
        stamina: 1.1,
        intelligence: 1.4
      }),
      description: 'A dark sorcerer who manipulates the forces of life and death to raise undead minions and curse enemies.'
    }
  ];
  
  module.exports = classTemplates;
  