const shopTemplates = [
    {
      name: 'General Store',
      inventory: JSON.stringify({
        items: [
          { item_id: 1, price: 10 },  // Health Potion
          { item_id: 2, price: 15 },  // Mana Potion
          { item_id: 7, price: 25 },  // Leather Boots
          { item_id: 8, price: 50 },  // Ring of Strength
          { item_id: 9, price: 75 },  // Amulet of Wisdom
          { item_id: 12, price: 100 } // Golden Ring
        ]
      })
    },
    {
      name: 'Blacksmith',
      inventory: JSON.stringify({
        items: [
          { item_id: 3, price: 100 }, // Round Shield
          { item_id: 5, price: 80 },  // Bronze Helmet
          { item_id: 6, price: 200 }, // Chestplate
          { item_id: 10, price: 60 }, // Leaf Tunic
          { item_id: 11, price: 150 } // Iron Sword
        ]
      })
    },
    {
      name: 'Ranger Supplies',
      inventory: JSON.stringify({
        items: [
          { item_id: 4, price: 120 }  // Short Bow
        ]
      })
    }
  ];
  
  module.exports = shopTemplates;
  