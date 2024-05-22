// test/models/Character.test.js

const Character = require('../../models/Character');

describe('Character', () => {
  it('should create an instance of Character with correct properties', () => {
    const character = new Character({
      id: 1,
      user_id: 1,
      name: 'Thalion',
      characterClass: 'ranger',
      baseStats: { strength: 10, wisdom: 15, intelligence: 8 },
      currentStats: { strength: 10, wisdom: 15, intelligence: 8 },
      current_area_id: 1,
      flags: [1, 2, 3]
    });

    expect(character.id).toBe(1);
    expect(character.userId).toBe(1);
    expect(character.name).toBe('Thalion');
    expect(character.characterClass).toBe('ranger');
    expect(character.baseStats).toEqual({ strength: 10, wisdom: 15, intelligence: 8 });
    expect(character.currentStats).toEqual({ strength: 10, wisdom: 15, intelligence: 8 });
    expect(character.currentAreaId).toBe(1);
    expect(character.flags).toEqual([1, 2, 3]);
  });

  it('should handle missing optional properties correctly', () => {
    const character = new Character({
      id: 2,
      user_id: 2,
      name: 'Eldrin',
      characterClass: 'mage',
      baseStats: { strength: 8, wisdom: 20, intelligence: 18 },
      currentStats: { strength: 8, wisdom: 20, intelligence: 18 },
      current_area_id: 2,
      flags: []
    });

    expect(character.id).toBe(2);
    expect(character.userId).toBe(2);
    expect(character.name).toBe('Eldrin');
    expect(character.characterClass).toBe('mage');
    expect(character.baseStats).toEqual({ strength: 8, wisdom: 20, intelligence: 18 });
    expect(character.currentStats).toEqual({ strength: 8, wisdom: 20, intelligence: 18 });
    expect(character.currentAreaId).toBe(2);
    expect(character.flags).toEqual([]);
  });
});
