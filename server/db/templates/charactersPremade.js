const charactersPremade = [
  {
    user_id: 1, 
    name: 'Thorn',
    class: 'Warrior',
    base_stats: JSON.stringify({
      strength: 20,
      agility: 10,
      intelligence: 5,
      health: 100
    }),
    current_stats: JSON.stringify({
      strength: 20,
      agility: 10,
      intelligence: 5,
      health: 100
    }),
    current_zone_id: 1
  },
  {
    user_id: 2,
    name: 'Elara',
    class: 'Ranger',
    base_stats: JSON.stringify({
      strength: 10,
      agility: 20,
      intelligence: 10,
      health: 80
    }),
    current_stats: JSON.stringify({
      strength: 10,
      agility: 20,
      intelligence: 10,
      health: 80
    }),
    current_zone_id: 1
  },
  {
    user_id: 3,
    name: 'Myst',
    class: 'Mage',
    base_stats: JSON.stringify({
      strength: 5,
      agility: 15,
      intelligence: 25,
      health: 60
    }),
    current_stats: JSON.stringify({
      strength: 5,
      agility: 15,
      intelligence: 25,
      health: 60
    }),
    current_zone_id: 1
  }
];

module.exports = charactersPremade;
