// test/models/CharacterInventory.test.js

const CharacterInventory = require('../../models/CharacterInventory');

describe('CharacterInventory', () => {
  it('should create an instance of CharacterInventory with correct properties', () => {
    const characterInventory = new CharacterInventory({
      id: 1,
      character_id: 1,
      inventory_slots: [101, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      gold: 100
    });

    expect(characterInventory.id).toBe(1);
    expect(characterInventory.characterId).toBe(1);
    expect(characterInventory.inventorySlots).toEqual([101, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    expect(characterInventory.gold).toBe(100);
  });

  it('should handle different inventory slot configurations correctly', () => {
    const characterInventory = new CharacterInventory({
      id: 2,
      character_id: 2,
      inventory_slots: [102, 103, 104],
      gold: 50
    });

    expect(characterInventory.id).toBe(2);
    expect(characterInventory.characterId).toBe(2);
    expect(characterInventory.inventorySlots).toEqual([102, 103, 104]);
    expect(characterInventory.gold).toBe(50);
  });
});
