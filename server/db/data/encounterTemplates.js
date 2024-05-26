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
    // 1 Orcish Warrior, 2 Orcish Grunts
    // 1 Orcish Warrior, 1 Orcish Hunter, 1 Orcish Mystic
    // 1 Orcish Mage, 2 Orcish Warriors
    // 1 Orcish Mystic, 1 Bugbear
    // 1 Ogre Mystic, 1 Orcish Warrior
    // 2 Dire Wolves
    // 1 Dire Wolf, 2 Orcish Warriors
    // 2 Bugbears
    // 2 Werebears
    // 3 Sneering Imps
    // 1 Owlbear Horror (is_boss)
    // 2 Dire Porcupines
    // 1 Giant Beetle, 1 Giant Wasp
    // 2 Giant Wasps
    // 2 Winged Garrotters
    // 1 Giant Beetle, 1 Giant Wasp, 1 Winged Garrotter
    // 1 Giant Spider, 1 Giant Wasp
    // 2 Giant Spiders
    // 1 Orcish Mage, 2 Giant Spiders
    // 1 Lumbering Centipede, 1 Giant Spider
    // 1 Lumbering Centipede, 1 Giant Spider, 1 Giant Wasp
    // 2 Flying Millipedes
    // 1 Demonic Howler (is_boss)
    // 1 Demonic Serpent (is_boss)
    // 1 Infested Treant (is_boss)
    // 3 Treant Youth
    // 2 Treant Youth, 1 Fiendish Shrub
    // 3 Fiendish Shrubs
    // 2 Forest Wights
  ];
  
module.exports = encounterTemplates;
  