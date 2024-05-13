const itemTemplates = [
    {
      name: 'Steel Sword',
      description: 'A durable sword forged from steel.',
      item_type: 'equipment',
      is_equipment: true,
      equipment_type: 'weapon',
      slot: 'hand',
      stats: JSON.stringify({ attack: 10, defense: 0 }),
      is_collectible: true
    },
    {
      name: 'Healing Potion',
      description: 'A potion that restores 50 health points.',
      item_type: 'consumable',
      is_equipment: false,
      is_collectible: true,
      use_effect: 'heal50'  // Reference to a script or function 'heal50'
    },
    {
      name: 'Ancient Relic',
      description: 'A mysterious artifact needed for a quest.',
      item_type: 'quest',
      is_equipment: false,
      is_collectible: true,
      use_effect: 'triggerQuestEvent'  // Reference to a script or function for quest triggering
    }
  ];
  
  module.exports = itemTemplates;
  