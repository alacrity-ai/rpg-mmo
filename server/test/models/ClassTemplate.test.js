// test/models/ClassTemplate.test.js

const ClassTemplate = require('../../models/ClassTemplate');

describe('ClassTemplate', () => {
  it('should create an instance of ClassTemplate with correct properties', () => {
    const classTemplate = new ClassTemplate({
      id: 1,
      name: 'rogue',
      base_stats: {
        strength: 5,
        stamina: 3,
        intelligence: 2
      },
      stat_level_scaling: {
        strength: 1.2,
        stamina: 1.1,
        intelligence: 1.0
      },
      description: 'A stealthy and agile fighter, adept at avoiding detection and striking from the shadows.'
    });

    expect(classTemplate.id).toBe(1);
    expect(classTemplate.name).toBe('rogue');
    expect(classTemplate.baseStats).toEqual({ strength: 5, stamina: 3, intelligence: 2 });
    expect(classTemplate.statLevelScaling).toEqual({ strength: 1.2, stamina: 1.1, intelligence: 1.0 });
    expect(classTemplate.description).toBe('A stealthy and agile fighter, adept at avoiding detection and striking from the shadows.');
  });

  it('should handle missing optional properties correctly', () => {
    const classTemplate = new ClassTemplate({
      id: 2,
      name: 'mage',
      base_stats: {
        strength: 2,
        stamina: 3,
        intelligence: 5
      },
      stat_level_scaling: {
        strength: 1.0,
        stamina: 1.1,
        intelligence: 1.2
      },
      description: ''
    });

    expect(classTemplate.id).toBe(2);
    expect(classTemplate.name).toBe('mage');
    expect(classTemplate.baseStats).toEqual({ strength: 2, stamina: 3, intelligence: 5 });
    expect(classTemplate.statLevelScaling).toEqual({ strength: 1.0, stamina: 1.1, intelligence: 1.2 });
    expect(classTemplate.description).toBe('');
  });
});
