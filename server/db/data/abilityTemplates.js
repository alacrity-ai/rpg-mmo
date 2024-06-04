// db/data/abilityTemplates.js


    // // Row 6
    // 'wooden-sword': { x: 0, y: 5 },
    // 'iron-sword': { x: 1, y: 5 },
    // 'steel-sword': { x: 2, y: 5 },
    // 'longsword': { x: 3, y: 5 },
    // 'shortsword': { x: 4, y: 5 },
    // 'sabre': { x: 5, y: 5 },
    // 'dagger': { x: 6, y: 5 },
    // 'broadsword': { x: 7, y: 5 },
    // 'sai': { x: 8, y: 5 },
    // 'dual swords': { x: 9, y: 5 },
    // 'axe': { x: 10, y: 5 },
    // 'battle-axe': { x: 11, y: 5 },
    // 'chain-mace': { x: 12, y: 5 },
    // 'spiked-club': { x: 13, y: 5 },
    // 'whip': { x: 14, y: 5 },
    // 'fist': { x: 15, y: 5 },

const abilityTemplates = [
    {
        name: 'Stab',
        short_name: 'rogueAttack',
        description: 'A quick and precise strike with a dagger.',
        type: 'attack',
        potency: 60,
        cost: 0,
        target_team: 'hostile',
        target_type: 'relative',
        target_area: JSON.stringify([[1, 0]]),
        cooldown_duration: 'normal',
        icon_name: 'dagger',
        sound_path: 'assets/sounds/rogue_strike.mp3'
    },
    {
        name: 'Smite',
        short_name: 'priestAttack',
        description: 'A divine attack that smites the enemy.',
        type: 'attack',
        potency: 40,
        cost: 0,
        target_team: 'hostile',
        target_type: 'relative',
        target_area: JSON.stringify([[1, 0], [2, 0], [3, 0]]),
        cooldown_duration: 'normal',
        icon_name: 'sparks',
        sound_path: 'assets/sounds/priest_smite.mp3'
    },
    {
        name: 'Slash',
        short_name: 'warriorAttack',
        description: 'A powerful slash with a sword.',
        type: 'attack',
        potency: 50,
        cost: 0,
        target_team: 'hostile',
        target_type: 'relative',
        target_area: JSON.stringify([[1, 0], [2, 0]]),
        cooldown_duration: 'normal',
        icon_name: 'iron-sword',
        sound_path: 'assets/sounds/warrior_slash.mp3'
    },
    {
        name: 'Strike',
        short_name: 'monkAttack',
        description: 'A swift strike aimed at the enemy.',
        type: 'attack',
        potency: 60,
        cost: 0,
        target_team: 'hostile',
        target_type: 'relative',
        target_area: JSON.stringify([[1, 0]]),
        cooldown_duration: 'normal',
        icon_name: 'fist',
        sound_path: 'assets/sounds/monk_punch.mp3'
    },
    {
        name: 'Fireball',
        short_name: 'fireball',
        description: 'A powerful fire attack.',
        type: 'spell',
        potency: 100,
        cost: 50,
        target_team: 'hostile',
        target_type: 'area',
        target_area: JSON.stringify([[0, 0], [0, 1], [0, 2]]),
        cooldown_duration: 'normal',
        icon_name: 'fireball',
        sound_path: 'assets/sounds/fireball.mp3'
    },
    {
        name: 'Healing Touch',
        short_name: 'healingTouch',
        description: 'A gentle touch that heals wounds.',
        type: 'spell',
        potency: 75,
        cost: 30,
        target_team: 'friendly',
        target_type: 'target',
        target_area: null,
        cooldown_duration: 'normal',
        icon_name: 'healing_touch',
        sound_path: 'assets/sounds/healing_touch.mp3'
    },
    {
        name: 'Earthquake',
        short_name: 'earthquake',
        description: 'Causes the ground to shake violently, damaging all enemies.',
        type: 'ability',
        potency: 120,
        cost: 70,
        target_team: 'hostile',
        target_type: 'area',
        target_area: JSON.stringify([[1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2]]),
        cooldown_duration: 'normal',
        icon_name: 'earthquake',
        sound_path: 'assets/sounds/earthquake.mp3'
    }
  ];
  
  module.exports = abilityTemplates;
  