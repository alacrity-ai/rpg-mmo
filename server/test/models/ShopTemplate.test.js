// test/models/ShopTemplate.test.js

const ShopTemplate = require('../../models/ShopTemplate');

describe('ShopTemplate', () => {
  it('should create an instance of ShopTemplate with correct properties', () => {
    const shopTemplate = new ShopTemplate({
      id: 1,
      name: 'General Store',
      inventory: {
        items: [
          { item_id: 1, price: 10 },
          { item_id: 2, price: 15 },
          { item_id: 7, price: 25 },
          { item_id: 8, price: 50 },
          { item_id: 9, price: 75 },
          { item_id: 12, price: 100 }
        ]
      }
    });

    expect(shopTemplate.id).toBe(1);
    expect(shopTemplate.name).toBe('General Store');
    expect(shopTemplate.inventory).toEqual({
      items: [
        { item_id: 1, price: 10 },
        { item_id: 2, price: 15 },
        { item_id: 7, price: 25 },
        { item_id: 8, price: 50 },
        { item_id: 9, price: 75 },
        { item_id: 12, price: 100 }
      ]
    });
  });

  it('should handle an empty inventory correctly', () => {
    const shopTemplate = new ShopTemplate({
      id: 2,
      name: 'Empty Shop',
      inventory: {
        items: []
      }
    });

    expect(shopTemplate.id).toBe(2);
    expect(shopTemplate.name).toBe('Empty Shop');
    expect(shopTemplate.inventory).toEqual({ items: [] });
  });

  it('should handle a single item in inventory correctly', () => {
    const shopTemplate = new ShopTemplate({
      id: 3,
      name: 'Potion Shop',
      inventory: {
        items: [
          { item_id: 3, price: 20 }
        ]
      }
    });

    expect(shopTemplate.id).toBe(3);
    expect(shopTemplate.name).toBe('Potion Shop');
    expect(shopTemplate.inventory).toEqual({ items: [{ item_id: 3, price: 20 }] });
  });
});
