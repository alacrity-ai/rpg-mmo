// db/data/npcTemplates.js

const npcTemplates = [
  {
    name: 'Bugbear',
    sprite_key: 'bugbear_sprite',
    description: 'Lumbering and brutish beast.',
    script_path: 'scripts/enemy_bugbear.js',
    base_stats: JSON.stringify({
      health: 20,
      mana: 0,
      strength: 3,
      stamina: 5,
      intelligence: 1
    }),
    loot_table: JSON.stringify([]),
    npc_dialogue_template_id: null,
    battler_sprite_path: 'assets/images/battlers/sprite_1.png'
  },
  {
    name: 'Werebear',
    sprite_key: 'werebear_sprite',
    description: 'A monstrous bear with a fearsome roar.',
    script_path: 'scripts/enemy_werebear.js',
    base_stats: JSON.stringify({
      health: 25,
      mana: 5,
      strength: 5,
      stamina: 6,
      intelligence: 2
    }),
    loot_table: JSON.stringify([]),
    npc_dialogue_template_id: null,
    battler_sprite_path: 'assets/images/battlers/sprite_2.png'
  },
  {
    name: 'Sneering Imp',
    sprite_key: 'sneering_imp_sprite',
    description: 'A small, mischievous demon with a wicked grin.',
    script_path: 'scripts/enemy_sneering_imp.js',
    base_stats: JSON.stringify({
      health: 15,
      mana: 10,
      strength: 2,
      stamina: 3,
      intelligence: 4
    }),
    loot_table: JSON.stringify([]),
    npc_dialogue_template_id: null,
    battler_sprite_path: 'assets/images/battlers/sprite_3.png'
  },
  {
    name: 'Owlbear Horror',
    sprite_key: 'owlbear_horror_sprite',
    description: 'A terrifying blend of owl and bear.',
    script_path: 'scripts/enemy_owlbear_horror.js',
    base_stats: JSON.stringify({
      health: 30,
      mana: 0,
      strength: 6,
      stamina: 7,
      intelligence: 2
    }),
    loot_table: JSON.stringify([]),
    npc_dialogue_template_id: null,
    battler_sprite_path: 'assets/images/battlers/sprite_4.png'
  },
  {
    name: 'Forest Wight',
    sprite_key: 'forest_wight_sprite',
    description: 'An undead creature that haunts the woods.',
    script_path: 'scripts/enemy_forest_wight.js',
    base_stats: JSON.stringify({
      health: 18,
      mana: 8,
      strength: 3,
      stamina: 4,
      intelligence: 3
    }),
    loot_table: JSON.stringify([]),
    npc_dialogue_template_id: null,
    battler_sprite_path: 'assets/images/battlers/sprite_5.png'
  },
  {
    name: 'Dire Wolf',
    sprite_key: 'dire_wolf_sprite',
    description: 'A giant and ferocious wolf.',
    script_path: 'scripts/enemy_dire_wolf.js',
    base_stats: JSON.stringify({
      health: 22,
      mana: 0,
      strength: 4,
      stamina: 5,
      intelligence: 2
    }),
    loot_table: JSON.stringify([]),
    npc_dialogue_template_id: null,
    battler_sprite_path: 'assets/images/battlers/sprite_6.png'
  },
  {
    name: 'Minor Horror',
    sprite_key: 'minor_horror_sprite',
    description: 'A lesser creature of pure terror.',
    script_path: 'scripts/enemy_minor_horror.js',
    base_stats: JSON.stringify({
      health: 16,
      mana: 6,
      strength: 2,
      stamina: 3,
      intelligence: 4
    }),
    loot_table: JSON.stringify([]),
    npc_dialogue_template_id: null,
    battler_sprite_path: 'assets/images/battlers/sprite_7.png'
  },
  {
    name: 'Shadow Sprite',
    sprite_key: 'shadow_sprite_sprite',
    description: 'A creature made of living shadow.',
    script_path: 'scripts/enemy_shadow_sprite.js',
    base_stats: JSON.stringify({
      health: 14,
      mana: 10,
      strength: 2,
      stamina: 3,
      intelligence: 5
    }),
    loot_table: JSON.stringify([]),
    npc_dialogue_template_id: null,
    battler_sprite_path: 'assets/images/battlers/sprite_8.png'
  },
  {
    name: 'Dire Porcupine',
    sprite_key: 'dire_porcupine_sprite',
    description: 'A large porcupine with deadly quills.',
    script_path: 'scripts/enemy_dire_porcupine.js',
    base_stats: JSON.stringify({
      health: 20,
      mana: 0,
      strength: 3,
      stamina: 5,
      intelligence: 1
    }),
    loot_table: JSON.stringify([]),
    npc_dialogue_template_id: null,
    battler_sprite_path: 'assets/images/battlers/sprite_9.png'
  },
  {
    name: 'Lumbering Centipede',
    sprite_key: 'lumbering_centipede_sprite',
    description: 'A giant centipede with a poisonous bite.',
    script_path: 'scripts/enemy_lumbering_centipede.js',
    base_stats: JSON.stringify({
      health: 24,
      mana: 0,
      strength: 4,
      stamina: 6,
      intelligence: 2
    }),
    loot_table: JSON.stringify([]),
    npc_dialogue_template_id: null,
    battler_sprite_path: 'assets/images/battlers/sprite_10.png'
  },
  {
    name: 'Fiendish Shrub',
    sprite_key: 'fiendish_shrub_sprite',
    description: 'A plant with a malevolent nature.',
    script_path: 'scripts/enemy_fiendish_shrub.js',
    base_stats: JSON.stringify({
      health: 18,
      mana: 5,
      strength: 3,
      stamina: 4,
      intelligence: 2
    }),
    loot_table: JSON.stringify([]),
    npc_dialogue_template_id: null,
    battler_sprite_path: 'assets/images/battlers/sprite_11.png'
  },
  {
    name: 'Infested Treant',
    sprite_key: 'infested_treant_sprite',
    description: 'A treant corrupted by dark forces, covered in parasitic vines.',
    script_path: 'scripts/enemy_infested_treant.js',
    base_stats: JSON.stringify({
      health: 35,
      mana: 5,
      strength: 6,
      stamina: 7,
      intelligence: 3
    }),
    loot_table: JSON.stringify([]),
    npc_dialogue_template_id: null,
    battler_sprite_path: 'assets/images/battlers/sprite_12.png'
  },
  {
    name: 'Deepforest Rat',
    sprite_key: 'deepforest_rat_sprite',
    description: 'A cunning rat that thrives in the shadows of the deep forest.',
    script_path: 'scripts/enemy_deepforest_rat.js',
    base_stats: JSON.stringify({
      health: 12,
      mana: 0,
      strength: 2,
      stamina: 3,
      intelligence: 2
    }),
    loot_table: JSON.stringify([]),
    npc_dialogue_template_id: null,
    battler_sprite_path: 'assets/images/battlers/sprite_13.png'
  },
  {
    name: 'Treant Youth',
    sprite_key: 'treant_youth_sprite',
    description: 'A young treant, still growing but already formidable.',
    script_path: 'scripts/enemy_treant_youth.js',
    base_stats: JSON.stringify({
      health: 25,
      mana: 3,
      strength: 5,
      stamina: 6,
      intelligence: 3
    }),
    loot_table: JSON.stringify([]),
    npc_dialogue_template_id: null,
    battler_sprite_path: 'assets/images/battlers/sprite_14.png'
  },
  {
    name: 'Orcish Hunter',
    sprite_key: 'orcish_hunter_sprite',
    description: 'An orc skilled in tracking and hunting prey.',
    script_path: 'scripts/enemy_orcish_hunter.js',
    base_stats: JSON.stringify({
      health: 22,
      mana: 2,
      strength: 4,
      stamina: 5,
      intelligence: 2
    }),
    loot_table: JSON.stringify([]),
    npc_dialogue_template_id: null,
    battler_sprite_path: 'assets/images/battlers/sprite_15.png'
  },
  {
    name: 'Orcish Mystic',
    sprite_key: 'orcish_mystic_sprite',
    description: 'An orc shaman who wields dark magic.',
    script_path: 'scripts/enemy_orcish_mystic.js',
    base_stats: JSON.stringify({
      health: 18,
      mana: 10,
      strength: 3,
      stamina: 4,
      intelligence: 5
    }),
    loot_table: JSON.stringify([]),
    npc_dialogue_template_id: null,
    battler_sprite_path: 'assets/images/battlers/sprite_16.png'
  },
  {
    name: 'Demonic Howler',
    sprite_key: 'demonic_howler_sprite',
    description: 'A demonic beast that terrifies with its bloodcurdling howl.',
    script_path: 'scripts/enemy_demonic_howler.js',
    base_stats: JSON.stringify({
      health: 20,
      mana: 8,
      strength: 5,
      stamina: 5,
      intelligence: 3
    }),
    loot_table: JSON.stringify([]),
    npc_dialogue_template_id: null,
    battler_sprite_path: 'assets/images/battlers/sprite_17.png'
  },
  {
    name: 'Lumbering Wolf',
    sprite_key: 'lumbering_wolf_sprite',
    description: 'A massive wolf that moves with a slow, predatory grace.',
    script_path: 'scripts/enemy_lumbering_wolf.js',
    base_stats: JSON.stringify({
      health: 24,
      mana: 0,
      strength: 4,
      stamina: 6,
      intelligence: 2
    }),
    loot_table: JSON.stringify([]),
    npc_dialogue_template_id: null,
    battler_sprite_path: 'assets/images/battlers/sprite_18.png'
  },
  {
    name: 'Winged Garrotter',
    sprite_key: 'winged_garrotter_sprite',
    description: 'A large and aggressive mosquito that preys on the weak.',
    script_path: 'scripts/enemy_winged_garrotter.js',
    base_stats: JSON.stringify({
      health: 10,
      mana: 0,
      strength: 2,
      stamina: 3,
      intelligence: 1
    }),
    loot_table: JSON.stringify([]),
    npc_dialogue_template_id: null,
    battler_sprite_path: 'assets/images/battlers/sprite_19.png'
  },
  {
    name: 'Ogre Mystic',
    sprite_key: 'ogre_mystic_sprite',
    description: 'A hulking ogre with surprising magical abilities.',
    script_path: 'scripts/enemy_ogre_mystic.js',
    base_stats: JSON.stringify({
      health: 40,
      mana: 15,
      strength: 8,
      stamina: 7,
      intelligence: 4
    }),
    loot_table: JSON.stringify([]),
    npc_dialogue_template_id: null,
    battler_sprite_path: 'assets/images/battlers/sprite_20.png'
  },
  {
    name: 'Orcish Runt',
    sprite_key: 'orcish_runt_sprite',
    description: 'A small and weak orc, often underestimated.',
    script_path: 'scripts/enemy_orcish_runt.js',
    base_stats: JSON.stringify({
      health: 12,
      mana: 0,
      strength: 3,
      stamina: 4,
      intelligence: 2
    }),
    loot_table: JSON.stringify([]),
    npc_dialogue_template_id: null,
    battler_sprite_path: 'assets/images/battlers/sprite_21.png'
  },
  {
    name: 'Banished Hunter',
    sprite_key: 'banished_hunter_sprite',
    description: 'A skilled hunter exiled from their tribe.',
    script_path: 'scripts/enemy_banished_hunter.js',
    base_stats: JSON.stringify({
      health: 22,
      mana: 3,
      strength: 5,
      stamina: 6,
      intelligence: 3
    }),
    loot_table: JSON.stringify([]),
    npc_dialogue_template_id: null,
    battler_sprite_path: 'assets/images/battlers/sprite_22.png'
  },
  {
    name: 'Orcish Mage',
    sprite_key: 'orcish_mage_sprite',
    description: 'An orc who has mastered the arcane arts.',
    script_path: 'scripts/enemy_orcish_mage.js',
    base_stats: JSON.stringify({
      health: 18,
      mana: 12,
      strength: 3,
      stamina: 4,
      intelligence: 5
    }),
    loot_table: JSON.stringify([]),
    npc_dialogue_template_id: null,
    battler_sprite_path: 'assets/images/battlers/sprite_23.png'
  },
  {
    name: 'Giant Spider',
    sprite_key: 'giant_spider_sprite',
    description: 'A terrifying spider that lurks in the dark, waiting for prey.',
    script_path: 'scripts/enemy_giant_spider.js',
    base_stats: JSON.stringify({
      health: 25,
      mana: 0,
      strength: 5,
      stamina: 7,
      intelligence: 2
    }),
    loot_table: JSON.stringify([]),
    npc_dialogue_template_id: null,
    battler_sprite_path: 'assets/images/battlers/sprite_24.png'
  },
  {
    name: 'Demonic Serpent',
    sprite_key: 'demonic_serpent_sprite',
    description: 'A snake infused with demonic energy, highly dangerous.',
    script_path: 'scripts/enemy_demonic_serpent.js',
    base_stats: JSON.stringify({
      health: 20,
      mana: 8,
      strength: 6,
      stamina: 5,
      intelligence: 4
    }),
    loot_table: JSON.stringify([]),
    npc_dialogue_template_id: null,
    battler_sprite_path: 'assets/images/battlers/sprite_25.png'
  },
  {
    name: 'Flying Millipede',
    sprite_key: 'flying_millipede_sprite',
    description: 'A grotesque millipede with wings, agile and deadly.',
    script_path: 'scripts/enemy_flying_millipede.js',
    base_stats: JSON.stringify({
      health: 15,
      mana: 0,
      strength: 4,
      stamina: 3,
      intelligence: 2
    }),
    loot_table: JSON.stringify([]),
    npc_dialogue_template_id: null,
    battler_sprite_path: 'assets/images/battlers/sprite_26.png'
  },
  {
    name: 'Orcish Warrior',
    sprite_key: 'orcish_warrior_sprite',
    description: 'A fierce orcish warrior, known for their brute strength.',
    script_path: 'scripts/enemy_orcish_warrior.js',
    base_stats: JSON.stringify({
      health: 30,
      mana: 0,
      strength: 7,
      stamina: 6,
      intelligence: 2
    }),
    loot_table: JSON.stringify([]),
    npc_dialogue_template_id: null,
    battler_sprite_path: 'assets/images/battlers/sprite_27.png'
  },
  {
    name: 'Giant Wasp',
    sprite_key: 'giant_wasp_sprite',
    description: 'A giant wasp with a venomous sting, swift and dangerous.',
    script_path: 'scripts/enemy_giant_wasp.js',
    base_stats: JSON.stringify({
      health: 20,
      mana: 0,
      strength: 5,
      stamina: 4,
      intelligence: 2
    }),
    loot_table: JSON.stringify([]),
    npc_dialogue_template_id: null,
    battler_sprite_path: 'assets/images/battlers/sprite_28.png'
  },
  {
    name: 'Giant Beetle',
    sprite_key: 'giant_beetle_sprite',
    description: 'A massive beetle with a hard shell, tough to crack.',
    script_path: 'scripts/enemy_giant_beetle.js',
    base_stats: JSON.stringify({
      health: 35,
      mana: 0,
      strength: 6,
      stamina: 7,
      intelligence: 2
    }),
    loot_table: JSON.stringify([]),
    npc_dialogue_template_id: null,
    battler_sprite_path: 'assets/images/battlers/sprite_29.png'
  }
];

module.exports = npcTemplates;
