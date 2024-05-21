const itemTemplates = [
  {
    name: 'Health Potion',
    description: 'A potion that restores health.',
    item_type: 'consumable',
    is_equipment: false,
    equipment_type: null,
    icon_key: 'health_potion_icon',
    stats: JSON.stringify({
      health_restore: 50
    }),
    is_collectible: true,
    use_effect: JSON.stringify({
      effect_type: 'restore_health',
      amount: 50
    })
  },
  {
    name: 'Sword',
    description: 'A basic sword for combat.',
    item_type: 'weapon',
    is_equipment: true,
    equipment_type: 'hand',
    icon_key: 'sword_icon',
    stats: JSON.stringify({
      attack: 10
    }),
    is_collectible: true,
    use_effect: null
  }
];

module.exports = itemTemplates;
