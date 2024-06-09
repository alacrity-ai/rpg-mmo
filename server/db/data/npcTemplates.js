// db/data/npcTemplates.js

const npcTemplates = [
  {
    name: 'Bugbear',
    sprite_key: 'bugbear_sprite',
    description: 'Lumbering and brutish beast.',
    script_path: 'testScript.js',
    script_speed: 2000,
    base_stats: JSON.stringify({
      health: 20,
      mana: 0,
      strength: 3,
      stamina: 5,
      intelligence: 1
    }),
    loot_table: JSON.stringify([]),
    npc_dialogue_template_id: null,
    battler_sprite_path: 'assets/images/battle/battlers/sprite_1'
  },
  {
    name: 'Werebear',
    sprite_key: 'werebear_sprite',
    description: 'A monstrous bear with a fearsome roar.',
    script_path: 'testScript.js',
    script_speed: 3000,
    base_stats: JSON.stringify({
      health: 25,
      mana: 5,
      strength: 5,
      stamina: 6,
      intelligence: 2
    }),
    loot_table: JSON.stringify([]),
    npc_dialogue_template_id: null,
    battler_sprite_path: 'assets/images/battle/battlers/sprite_2'
  },
  {
    name: 'Sneering Imp',
    sprite_key: 'sneering_imp_sprite',
    description: 'A small, mischievous demon with a wicked grin.',
    script_path: 'testScript.js',
    script_speed: 2000,
    base_stats: JSON.stringify({
      health: 15,
      mana: 10,
      strength: 2,
      stamina: 3,
      intelligence: 4
    }),
    loot_table: JSON.stringify([]),
    npc_dialogue_template_id: null,
    battler_sprite_path: 'assets/images/battle/battlers/sprite_3'
  },
  {
    name: 'Owlbear Horror',
    sprite_key: 'owlbear_horror_sprite',
    description: 'A terrifying blend of owl and bear.',
    script_path: 'testScript.js',
    script_speed: 2000,
    base_stats: JSON.stringify({
      health: 30,
      mana: 0,
      strength: 6,
      stamina: 7,
      intelligence: 2
    }),
    loot_table: JSON.stringify([]),
    npc_dialogue_template_id: null,
    battler_sprite_path: 'assets/images/battle/battlers/sprite_4'
  },
  {
    name: 'Forest Wight',
    sprite_key: 'forest_wight_sprite',
    description: 'An undead creature that haunts the woods.',
    script_path: 'testScript.js',
    script_speed: 2000,
    base_stats: JSON.stringify({
      health: 18,
      mana: 8,
      strength: 3,
      stamina: 4,
      intelligence: 3
    }),
    loot_table: JSON.stringify([]),
    npc_dialogue_template_id: null,
    battler_sprite_path: 'assets/images/battle/battlers/sprite_5'
  },
  {
    name: 'Dire Wolf',
    sprite_key: 'dire_wolf_sprite',
    description: 'A giant and ferocious wolf.',
    script_path: 'testScript.js',
    script_speed: 2000,
    base_stats: JSON.stringify({
      health: 22,
      mana: 0,
      strength: 4,
      stamina: 5,
      intelligence: 2
    }),
    loot_table: JSON.stringify([]),
    npc_dialogue_template_id: null,
    battler_sprite_path: 'assets/images/battle/battlers/sprite_6'
  },
  {
    name: 'Minor Horror',
    sprite_key: 'minor_horror_sprite',
    description: 'A lesser creature of pure terror.',
    script_path: 'testScript.js',
    script_speed: 2000,
    base_stats: JSON.stringify({
      health: 16,
      mana: 6,
      strength: 2,
      stamina: 3,
      intelligence: 4
    }),
    loot_table: JSON.stringify([]),
    npc_dialogue_template_id: null,
    battler_sprite_path: 'assets/images/battle/battlers/sprite_7'
  },
  {
    name: 'Shadow Sprite',
    sprite_key: 'shadow_sprite_sprite',
    description: 'A creature made of living shadow.',
    script_path: 'testScript.js',
    script_speed: 2000,
    base_stats: JSON.stringify({
      health: 14,
      mana: 10,
      strength: 2,
      stamina: 3,
      intelligence: 5
    }),
    loot_table: JSON.stringify([]),
    npc_dialogue_template_id: null,
    battler_sprite_path: 'assets/images/battle/battlers/sprite_8'
  },
  {
    name: 'Dire Porcupine',
    sprite_key: 'dire_porcupine_sprite',
    description: 'A large porcupine with deadly quills.',
    script_path: 'testScript.js',
    script_speed: 2000,
    base_stats: JSON.stringify({
      health: 20,
      mana: 0,
      strength: 3,
      stamina: 5,
      intelligence: 1
    }),
    loot_table: JSON.stringify([]),
    npc_dialogue_template_id: null,
    battler_sprite_path: 'assets/images/battle/battlers/sprite_9'
  },
  {
    name: 'Lumbering Centipede',
    sprite_key: 'lumbering_centipede_sprite',
    description: 'A giant centipede with a poisonous bite.',
    script_path: 'testScript.js',
    script_speed: 2000,
    base_stats: JSON.stringify({
      health: 24,
      mana: 0,
      strength: 4,
      stamina: 6,
      intelligence: 2
    }),
    loot_table: JSON.stringify([]),
    npc_dialogue_template_id: null,
    battler_sprite_path: 'assets/images/battle/battlers/sprite_10'
  },
  {
    name: 'Fiendish Shrub',
    sprite_key: 'fiendish_shrub_sprite',
    description: 'A plant with a malevolent nature.',
    script_path: 'testScript.js',
    script_speed: 2000,
    base_stats: JSON.stringify({
      health: 18,
      mana: 5,
      strength: 3,
      stamina: 4,
      intelligence: 2
    }),
    loot_table: JSON.stringify([]),
    npc_dialogue_template_id: null,
    battler_sprite_path: 'assets/images/battle/battlers/sprite_11'
  },
  {
    name: 'Infested Treant',
    sprite_key: 'infested_treant_sprite',
    description: 'A treant corrupted by dark forces, covered in parasitic vines.',
    script_path: 'testScript.js',
    script_speed: 2000,
    base_stats: JSON.stringify({
      health: 35,
      mana: 5,
      strength: 6,
      stamina: 7,
      intelligence: 3
    }),
    loot_table: JSON.stringify([]),
    npc_dialogue_template_id: null,
    battler_sprite_path: 'assets/images/battle/battlers/sprite_12'
  },
  {
    name: 'Deepforest Rat',
    sprite_key: 'deepforest_rat_sprite',
    description: 'A cunning rat that thrives in the shadows of the deep forest.',
    script_path: 'testScript.js',
    script_speed: 2000,
    base_stats: JSON.stringify({
      health: 12,
      mana: 0,
      strength: 2,
      stamina: 3,
      intelligence: 2
    }),
    loot_table: JSON.stringify([]),
    npc_dialogue_template_id: null,
    battler_sprite_path: 'assets/images/battle/battlers/sprite_13'
  },
  {
    name: 'Treant Youth',
    sprite_key: 'treant_youth_sprite',
    description: 'A young treant, still growing but already formidable.',
    script_path: 'testScript.js',
    script_speed: 2000,
    base_stats: JSON.stringify({
      health: 25,
      mana: 3,
      strength: 5,
      stamina: 6,
      intelligence: 3
    }),
    loot_table: JSON.stringify([]),
    npc_dialogue_template_id: null,
    battler_sprite_path: 'assets/images/battle/battlers/sprite_14'
  },
  {
    name: 'Orcish Hunter',
    sprite_key: 'orcish_hunter_sprite',
    description: 'An orc skilled in tracking and hunting prey.',
    script_path: 'testScript.js',
    script_speed: 2000,
    base_stats: JSON.stringify({
      health: 22,
      mana: 2,
      strength: 4,
      stamina: 5,
      intelligence: 2
    }),
    loot_table: JSON.stringify([]),
    npc_dialogue_template_id: null,
    battler_sprite_path: 'assets/images/battle/battlers/sprite_15'
  },
  {
    name: 'Orcish Mystic',
    sprite_key: 'orcish_mystic_sprite',
    description: 'An orc shaman who wields dark magic.',
    script_path: 'testScript.js',
    script_speed: 2000,
    base_stats: JSON.stringify({
      health: 18,
      mana: 10,
      strength: 3,
      stamina: 4,
      intelligence: 5
    }),
    loot_table: JSON.stringify([]),
    npc_dialogue_template_id: null,
    battler_sprite_path: 'assets/images/battle/battlers/sprite_16'
  },
  {
    name: 'Demonic Howler',
    sprite_key: 'demonic_howler_sprite',
    description: 'A demonic beast that terrifies with its bloodcurdling howl.',
    script_path: 'testScript.js',
    script_speed: 2000,
    base_stats: JSON.stringify({
      health: 20,
      mana: 8,
      strength: 5,
      stamina: 5,
      intelligence: 3
    }),
    loot_table: JSON.stringify([]),
    npc_dialogue_template_id: null,
    battler_sprite_path: 'assets/images/battle/battlers/sprite_17'
  },
  {
    name: 'Lumbering Wolf',
    sprite_key: 'lumbering_wolf_sprite',
    description: 'A massive wolf that moves with a slow, predatory grace.',
    script_path: 'testScript.js',
    script_speed: 2000,
    base_stats: JSON.stringify({
      health: 24,
      mana: 0,
      strength: 4,
      stamina: 6,
      intelligence: 2
    }),
    loot_table: JSON.stringify([]),
    npc_dialogue_template_id: null,
    battler_sprite_path: 'assets/images/battle/battlers/sprite_18'
  },
  {
    name: 'Winged Garrotter',
    sprite_key: 'winged_garrotter_sprite',
    description: 'A large and aggressive mosquito that preys on the weak.',
    script_path: 'testScript.js',
    script_speed: 2000,
    base_stats: JSON.stringify({
      health: 10,
      mana: 0,
      strength: 2,
      stamina: 3,
      intelligence: 1
    }),
    loot_table: JSON.stringify([]),
    npc_dialogue_template_id: null,
    battler_sprite_path: 'assets/images/battle/battlers/sprite_19'
  },
  {
    name: 'Ogre Mystic',
    sprite_key: 'ogre_mystic_sprite',
    description: 'A hulking ogre with surprising magical abilities.',
    script_path: 'testScript.js',
    script_speed: 2000,
    base_stats: JSON.stringify({
      health: 40,
      mana: 15,
      strength: 8,
      stamina: 7,
      intelligence: 4
    }),
    loot_table: JSON.stringify([]),
    npc_dialogue_template_id: null,
    battler_sprite_path: 'assets/images/battle/battlers/sprite_20'
  },
  {
    name: 'Orcish Runt',
    sprite_key: 'orcish_runt_sprite',
    description: 'A small and weak orc, often underestimated.',
    script_path: 'testScript.js',
    script_speed: 2000,
    base_stats: JSON.stringify({
      health: 12,
      mana: 0,
      strength: 3,
      stamina: 4,
      intelligence: 2
    }),
    loot_table: JSON.stringify([]),
    npc_dialogue_template_id: null,
    battler_sprite_path: 'assets/images/battle/battlers/sprite_21'
  },
  {
    name: 'Banished Hunter',
    sprite_key: 'banished_hunter_sprite',
    description: 'A skilled hunter exiled from their tribe.',
    script_path: 'testScript.js',
    script_speed: 2000,
    base_stats: JSON.stringify({
      health: 22,
      mana: 3,
      strength: 5,
      stamina: 6,
      intelligence: 3
    }),
    loot_table: JSON.stringify([]),
    npc_dialogue_template_id: null,
    battler_sprite_path: 'assets/images/battle/battlers/sprite_22'
  },
  {
    name: 'Orcish Mage',
    sprite_key: 'orcish_mage_sprite',
    description: 'An orc who has mastered the arcane arts.',
    script_path: 'testScript.js',
    script_speed: 2000,
    base_stats: JSON.stringify({
      health: 18,
      mana: 12,
      strength: 3,
      stamina: 4,
      intelligence: 5
    }),
    loot_table: JSON.stringify([]),
    npc_dialogue_template_id: null,
    battler_sprite_path: 'assets/images/battle/battlers/sprite_23'
  },
  {
    name: 'Giant Spider',
    sprite_key: 'giant_spider_sprite',
    description: 'A terrifying spider that lurks in the dark, waiting for prey.',
    script_path: 'testScript.js',
    script_speed: 2000,
    base_stats: JSON.stringify({
      health: 25,
      mana: 0,
      strength: 5,
      stamina: 7,
      intelligence: 2
    }),
    loot_table: JSON.stringify([]),
    npc_dialogue_template_id: null,
    battler_sprite_path: 'assets/images/battle/battlers/sprite_24'
  },
  {
    name: 'Demonic Serpent',
    sprite_key: 'demonic_serpent_sprite',
    description: 'A snake infused with demonic energy, highly dangerous.',
    script_path: 'testScript.js',
    script_speed: 2000,
    base_stats: JSON.stringify({
      health: 20,
      mana: 8,
      strength: 6,
      stamina: 5,
      intelligence: 4
    }),
    loot_table: JSON.stringify([]),
    npc_dialogue_template_id: null,
    battler_sprite_path: 'assets/images/battle/battlers/sprite_25'
  },
  {
    name: 'Flying Millipede',
    sprite_key: 'flying_millipede_sprite',
    description: 'A grotesque millipede with wings, agile and deadly.',
    script_path: 'testScript.js',
    script_speed: 2000,
    base_stats: JSON.stringify({
      health: 15,
      mana: 0,
      strength: 4,
      stamina: 3,
      intelligence: 2
    }),
    loot_table: JSON.stringify([]),
    npc_dialogue_template_id: null,
    battler_sprite_path: 'assets/images/battle/battlers/sprite_26'
  },
  {
    name: 'Orcish Warrior',
    sprite_key: 'orcish_warrior_sprite',
    description: 'A fierce orcish warrior, known for their brute strength.',
    script_path: 'testScript.js',
    script_speed: 2000,
    base_stats: JSON.stringify({
      health: 30,
      mana: 0,
      strength: 7,
      stamina: 6,
      intelligence: 2
    }),
    loot_table: JSON.stringify([]),
    npc_dialogue_template_id: null,
    battler_sprite_path: 'assets/images/battle/battlers/sprite_27'
  },
  {
    name: 'Giant Wasp',
    sprite_key: 'giant_wasp_sprite',
    description: 'A giant wasp with a venomous sting, swift and dangerous.',
    script_path: 'testScript.js',
    script_speed: 2000,
    base_stats: JSON.stringify({
      health: 20,
      mana: 0,
      strength: 5,
      stamina: 4,
      intelligence: 2
    }),
    loot_table: JSON.stringify([]),
    npc_dialogue_template_id: null,
    battler_sprite_path: 'assets/images/battle/battlers/sprite_28'
  },
  {
    name: 'Giant Beetle',
    sprite_key: 'giant_beetle_sprite',
    description: 'A massive beetle with a hard shell, tough to crack.',
    script_path: 'testScript.js',
    script_speed: 2000,
    base_stats: JSON.stringify({
      health: 35,
      mana: 0,
      strength: 6,
      stamina: 7,
      intelligence: 2
    }),
    loot_table: JSON.stringify([]),
    npc_dialogue_template_id: null,
    battler_sprite_path: 'assets/images/battle/battlers/sprite_29'
  }
];

module.exports = npcTemplates;
