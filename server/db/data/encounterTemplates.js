// db/data/encounterTemplates.js

const encounterTemplates = [
    {
      name: 'Goblin Ambush',
      enemies: JSON.stringify([
        { npc_template_id: 1, position: 0 },
        { npc_template_id: 1, position: 1 },
        { npc_template_id: 2, position: 2 }
      ]),
      is_boss: false
    },
    {
      name: 'Dragon\'s Lair',
      enemies: JSON.stringify([
        { npc_template_id: 3, position: 4 }
      ]),
      is_boss: true
    }
  ];
  
module.exports = encounterTemplates;
  