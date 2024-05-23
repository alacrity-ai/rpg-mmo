const itemTemplates = [
  {
    name: 'Health Potion',
    description: 'A potion that restores health.',
    item_type: 'consumable',
    is_equipment: false,
    equipment_type: null,
    icon_key: 'potion-red',
    stats: JSON.stringify({
      health_restore: 50
    }),
    is_collectible: true,
    use_effect: JSON.stringify({
      effect_type: 'restore_health',
      amount: 50
    }),
    classes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  },
  {
    name: 'Mana Potion',
    description: 'A potion that restores mana.',
    item_type: 'consumable',
    is_equipment: false,
    equipment_type: null,
    icon_key: 'potion-blue',
    stats: JSON.stringify({
      mana_restore: 40
    }),
    is_collectible: true,
    use_effect: JSON.stringify({
      effect_type: 'restore_mana',
      amount: 40
    }),
    classes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  },
  {
    name: 'Round Shield',
    description: 'A sturdy shield for defense.',
    item_type: 'armor',
    is_equipment: true,
    equipment_type: 'off-hand',
    icon_key: 'round-shield',
    stats: JSON.stringify({
      defense: 15
    }),
    is_collectible: true,
    use_effect: null,
    classes: [4, 5, 6]
  },
  {
    name: 'Short Bow',
    description: 'A basic bow for ranged attacks.',
    item_type: 'weapon',
    is_equipment: true,
    equipment_type: 'two-hand',
    icon_key: 'bow-and-arrow',
    stats: JSON.stringify({
      attack: 8
    }),
    is_collectible: true,
    use_effect: null,
    classes: [3]
  },
  {
    name: 'Bronze Helmet',
    description: 'A helmet for head protection.',
    item_type: 'armor',
    is_equipment: true,
    equipment_type: 'head',
    icon_key: 'bronze-helmet',
    stats: JSON.stringify({
      defense: 5
    }),
    is_collectible: true,
    use_effect: null,
    classes: [4, 5, 6]
  },
  {
    name: 'Chestplate',
    description: 'A chestplate for body protection.',
    item_type: 'armor',
    is_equipment: true,
    equipment_type: 'chest',
    icon_key: 'steel-cuirass',
    stats: JSON.stringify({
      defense: 20
    }),
    is_collectible: true,
    use_effect: null,
    classes: [4, 5, 6]
  },
  {
    name: 'Leather Boots',
    description: 'Boots for foot protection.',
    item_type: 'armor',
    is_equipment: true,
    equipment_type: 'feet',
    icon_key: 'leather-boots',
    stats: JSON.stringify({
      defense: 5,
      speed: 2
    }),
    is_collectible: true,
    use_effect: null,
    classes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  },
  {
    name: 'Ring of Strength',
    description: 'A ring that increases strength.',
    item_type: 'accessory',
    is_equipment: true,
    equipment_type: 'ring',
    icon_key: 'gold-ring',
    stats: JSON.stringify({
      strength: 5
    }),
    is_collectible: true,
    use_effect: null,
    classes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  },
  {
    name: 'Amulet of Wisdom',
    description: 'An amulet that increases intelligence.',
    item_type: 'accessory',
    is_equipment: true,
    equipment_type: 'neck',
    icon_key: 'beaded-necklace',
    stats: JSON.stringify({
      intelligence: 7
    }),
    is_collectible: true,
    use_effect: null,
    classes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  },
  {
    name: 'Leaf Tunic',
    description: 'A tunic made from foliage',
    item_type: 'armor',
    is_equipment: true,
    equipment_type: 'chest',
    icon_key: 'green-tunic',
    stats: JSON.stringify({
      defense: 10
    }),
    is_collectible: true,
    use_effect: null,
    classes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  },
  {
    name: 'Iron Sword',
    description: 'A sword made of iron.',
    item_type: 'weapon',
    is_equipment: true,
    equipment_type: 'one-hand',
    icon_key: 'iron-sword',
    stats: JSON.stringify({
      attack: 15
    }),
    is_collectible: true,
    use_effect: null,
    classes: [1, 4, 5, 6]
  },
  {
    name: 'Golden Ring',
    description: 'A ring made of gold.',
    item_type: 'accessory',
    is_equipment: true,
    equipment_type: 'ring',
    icon_key: 'gold-ring',
    stats: JSON.stringify({
      charisma: 3
    }),
    is_collectible: true,
    use_effect: null,
    classes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  }
];

module.exports = itemTemplates;
