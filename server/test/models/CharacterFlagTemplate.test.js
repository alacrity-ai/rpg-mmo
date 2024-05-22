// test/models/CharacterFlagTemplate.test.js

const CharacterFlagTemplate = require('../../models/CharacterFlagTemplate');

describe('CharacterFlagTemplate', () => {
  it('should create an instance of CharacterFlagTemplate with correct properties', () => {
    const flagTemplate = new CharacterFlagTemplate({
      id: 1,
      name: 'hasTalkedToBlacksmith',
      description: 'Indicates if the character has talked to the blacksmith.'
    });

    expect(flagTemplate.id).toBe(1);
    expect(flagTemplate.name).toBe('hasTalkedToBlacksmith');
    expect(flagTemplate.description).toBe('Indicates if the character has talked to the blacksmith.');
  });

  it('should handle missing description property correctly', () => {
    const flagTemplate = new CharacterFlagTemplate({
      id: 2,
      name: 'hasCompletedQuest'
    });

    expect(flagTemplate.id).toBe(2);
    expect(flagTemplate.name).toBe('hasCompletedQuest');
    expect(flagTemplate.description).toBe('');
  });
});
