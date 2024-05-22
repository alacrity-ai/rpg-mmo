// test/models/ItemTemplate.test.js

const ItemTemplate = require('../../models/ItemTemplate');

describe('ItemTemplate', () => {
  it('should create an instance of ItemTemplate with correct properties', () => {
    const itemTemplate = new ItemTemplate({
      id: 1,
      name: 'Health Potion',
      description: 'A potion that restores health.',
      item_type: 'consumable',
      is_equipment: false,
      equipment_type: null,
      icon_key: 'potion-red',
      classes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      stats: {
        health_restore: 50
      },
      is_collectible: true,
      use_effect: {
        effect_type: 'restore_health',
        amount: 50
      }
    });

    expect(itemTemplate.id).toBe(1);
    expect(itemTemplate.name).toBe('Health Potion');
    expect(itemTemplate.description).toBe('A potion that restores health.');
    expect(itemTemplate.itemType).toBe('consumable');
    expect(itemTemplate.isEquipment).toBe(false);
    expect(itemTemplate.equipmentType).toBeNull();
    expect(itemTemplate.iconKey).toBe('potion-red');
    expect(itemTemplate.classes).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    expect(itemTemplate.stats).toEqual({ health_restore: 50 });
    expect(itemTemplate.isCollectible).toBe(true);
    expect(itemTemplate.useEffect).toEqual({ effect_type: 'restore_health', amount: 50 });
  });

  it('should handle equipment items correctly', () => {
    const itemTemplate = new ItemTemplate({
      id: 2,
      name: 'Sword of Might',
      description: 'A powerful sword.',
      item_type: 'weapon',
      is_equipment: true,
      equipment_type: 'sword',
      icon_key: 'sword-might',
      classes: [1, 2, 3],
      stats: {
        attack: 10
      },
      is_collectible: false,
      use_effect: {}
    });

    expect(itemTemplate.id).toBe(2);
    expect(itemTemplate.name).toBe('Sword of Might');
    expect(itemTemplate.description).toBe('A powerful sword.');
    expect(itemTemplate.itemType).toBe('weapon');
    expect(itemTemplate.isEquipment).toBe(true);
    expect(itemTemplate.equipmentType).toBe('sword');
    expect(itemTemplate.iconKey).toBe('sword-might');
    expect(itemTemplate.classes).toEqual([1, 2, 3]);
    expect(itemTemplate.stats).toEqual({ attack: 10 });
    expect(itemTemplate.isCollectible).toBe(false);
    expect(itemTemplate.useEffect).toEqual({});
  });

  it('should handle items with no optional properties correctly', () => {
    const itemTemplate = new ItemTemplate({
      id: 3,
      name: 'Mysterious Item',
      description: 'An item with unknown properties.',
      item_type: 'misc',
      is_equipment: false,
      equipment_type: null,
      icon_key: 'mysterious-item',
      classes: [],
      stats: {},
      is_collectible: false,
      use_effect: {}
    });

    expect(itemTemplate.id).toBe(3);
    expect(itemTemplate.name).toBe('Mysterious Item');
    expect(itemTemplate.description).toBe('An item with unknown properties.');
    expect(itemTemplate.itemType).toBe('misc');
    expect(itemTemplate.isEquipment).toBe(false);
    expect(itemTemplate.equipmentType).toBeNull();
    expect(itemTemplate.iconKey).toBe('mysterious-item');
    expect(itemTemplate.classes).toEqual([]);
    expect(itemTemplate.stats).toEqual({});
    expect(itemTemplate.isCollectible).toBe(false);
    expect(itemTemplate.useEffect).toEqual({});
  });
});
