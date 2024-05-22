// test/models/StatusTemplate.test.js

const StatusTemplate = require('../../models/StatusTemplate');

describe('StatusTemplate', () => {
  it('should create an instance of StatusTemplate with correct properties', () => {
    const statusTemplate = new StatusTemplate({
      id: 1,
      name: 'Poison',
      description: 'Reduces health over time.',
      effect_type: 'debuff',
      effect_details: { health_reduction: 5, duration: 10 }
    });

    expect(statusTemplate.id).toBe(1);
    expect(statusTemplate.name).toBe('Poison');
    expect(statusTemplate.description).toBe('Reduces health over time.');
    expect(statusTemplate.effectType).toBe('debuff');
    expect(statusTemplate.effectDetails).toEqual({ health_reduction: 5, duration: 10 });
  });

  it('should handle different effect types correctly', () => {
    const statusTemplate = new StatusTemplate({
      id: 2,
      name: 'Blessing',
      description: 'Increases health over time.',
      effect_type: 'buff',
      effect_details: { health_increase: 5, duration: 10 }
    });

    expect(statusTemplate.id).toBe(2);
    expect(statusTemplate.name).toBe('Blessing');
    expect(statusTemplate.description).toBe('Increases health over time.');
    expect(statusTemplate.effectType).toBe('buff');
    expect(statusTemplate.effectDetails).toEqual({ health_increase: 5, duration: 10 });
  });

  it('should handle missing optional properties correctly', () => {
    const statusTemplate = new StatusTemplate({
      id: 3,
      name: 'Stun',
      description: 'Stuns the character.',
      effect_type: 'debuff',
      effect_details: { duration: 5 }
    });

    expect(statusTemplate.id).toBe(3);
    expect(statusTemplate.name).toBe('Stun');
    expect(statusTemplate.description).toBe('Stuns the character.');
    expect(statusTemplate.effectType).toBe('debuff');
    expect(statusTemplate.effectDetails).toEqual({ duration: 5 });
  });
});
