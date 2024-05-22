// test/models/CharacterParty.test.js

const CharacterParty = require('../../models/CharacterParty');

describe('CharacterParty', () => {
  it('should create an instance of CharacterParty with correct properties', () => {
    const party = new CharacterParty({
      id: 1,
      members: [
        { user_id: 1, character_id: 101 },
        { user_id: 2, character_id: 102 },
        { user_id: 3, character_id: 103 },
        { user_id: 4, character_id: 104 }
      ]
    });

    expect(party.id).toBe(1);
    expect(party.members).toEqual([
      { user_id: 1, character_id: 101 },
      { user_id: 2, character_id: 102 },
      { user_id: 3, character_id: 103 },
      { user_id: 4, character_id: 104 }
    ]);
  });

  it('should handle an empty members array correctly', () => {
    const party = new CharacterParty({
      id: 2,
      members: []
    });

    expect(party.id).toBe(2);
    expect(party.members).toEqual([]);
  });

  it('should handle a single member correctly', () => {
    const party = new CharacterParty({
      id: 3,
      members: [
        { user_id: 1, character_id: 101 }
      ]
    });

    expect(party.id).toBe(3);
    expect(party.members).toEqual([
      { user_id: 1, character_id: 101 }
    ]);
  });
});
