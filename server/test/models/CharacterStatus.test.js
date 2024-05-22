// test/models/CharacterStatus.test.js

const CharacterStatus = require('../../models/CharacterStatus');

describe('CharacterStatus', () => {
  it('should create an instance of CharacterStatus with correct properties', () => {
    const characterStatus = new CharacterStatus({
      id: 1,
      character_id: 1,
      statuses: [
        { id: 101, applied_at: '2024-05-20T15:00:00Z' },
        { id: 102, applied_at: '2024-05-20T15:05:00Z' }
      ]
    });

    expect(characterStatus.id).toBe(1);
    expect(characterStatus.characterId).toBe(1);
    expect(characterStatus.statuses).toEqual([
      { id: 101, applied_at: '2024-05-20T15:00:00Z' },
      { id: 102, applied_at: '2024-05-20T15:05:00Z' }
    ]);
  });

  it('should handle an empty statuses array correctly', () => {
    const characterStatus = new CharacterStatus({
      id: 2,
      character_id: 2,
      statuses: []
    });

    expect(characterStatus.id).toBe(2);
    expect(characterStatus.characterId).toBe(2);
    expect(characterStatus.statuses).toEqual([]);
  });

  it('should handle a single status correctly', () => {
    const characterStatus = new CharacterStatus({
      id: 3,
      character_id: 3,
      statuses: [
        { id: 103, applied_at: '2024-05-21T10:00:00Z' }
      ]
    });

    expect(characterStatus.id).toBe(3);
    expect(characterStatus.characterId).toBe(3);
    expect(characterStatus.statuses).toEqual([
      { id: 103, applied_at: '2024-05-21T10:00:00Z' }
    ]);
  });
});
