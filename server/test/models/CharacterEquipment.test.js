// test/models/CharacterEquipment.test.js

const CharacterEquipment = require('../../models/CharacterEquipment');

describe('CharacterEquipment', () => {
  it('should create an instance of CharacterEquipment with correct properties', () => {
    const characterEquipment = new CharacterEquipment({
      id: 1,
      character_id: 1,
      main_hand: 101,
      off_hand: 102,
      two_hand: null,
      ammo: 201,
      head: 301,
      chest: 302,
      hands: 303,
      waist: 304,
      feet: 305,
      ring1: 401,
      ring2: 402,
      neck: 501
    });

    expect(characterEquipment.id).toBe(1);
    expect(characterEquipment.characterId).toBe(1);
    expect(characterEquipment.mainHand).toBe(101);
    expect(characterEquipment.offHand).toBe(102);
    expect(characterEquipment.twoHand).toBeNull();
    expect(characterEquipment.ammo).toBe(201);
    expect(characterEquipment.head).toBe(301);
    expect(characterEquipment.chest).toBe(302);
    expect(characterEquipment.hands).toBe(303);
    expect(characterEquipment.waist).toBe(304);
    expect(characterEquipment.feet).toBe(305);
    expect(characterEquipment.ring1).toBe(401);
    expect(characterEquipment.ring2).toBe(402);
    expect(characterEquipment.neck).toBe(501);
  });

  it('should handle missing optional properties correctly', () => {
    const characterEquipment = new CharacterEquipment({
      id: 2,
      character_id: 2
    });

    expect(characterEquipment.id).toBe(2);
    expect(characterEquipment.characterId).toBe(2);
    expect(characterEquipment.mainHand).toBeUndefined();
    expect(characterEquipment.offHand).toBeUndefined();
    expect(characterEquipment.twoHand).toBeUndefined();
    expect(characterEquipment.ammo).toBeUndefined();
    expect(characterEquipment.head).toBeUndefined();
    expect(characterEquipment.chest).toBeUndefined();
    expect(characterEquipment.hands).toBeUndefined();
    expect(characterEquipment.waist).toBeUndefined();
    expect(characterEquipment.feet).toBeUndefined();
    expect(characterEquipment.ring1).toBeUndefined();
    expect(characterEquipment.ring2).toBeUndefined();
    expect(characterEquipment.neck).toBeUndefined();
  });
});
