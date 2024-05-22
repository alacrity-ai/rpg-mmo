// test/models/EncounterTemplate.test.js

const EncounterTemplate = require('../../models/EncounterTemplate');

describe('EncounterTemplate', () => {
  it('should create an instance of EncounterTemplate with correct properties', () => {
    const encounterTemplate = new EncounterTemplate({
      id: 1,
      name: 'Goblin Ambush',
      enemies: [
        { npc_template_id: 1, position: 0 },
        { npc_template_id: 1, position: 1 },
        { npc_template_id: 2, position: 2 }
      ],
      is_boss: false
    });

    expect(encounterTemplate.id).toBe(1);
    expect(encounterTemplate.name).toBe('Goblin Ambush');
    expect(encounterTemplate.enemies).toEqual([
      { npc_template_id: 1, position: 0 },
      { npc_template_id: 1, position: 1 },
      { npc_template_id: 2, position: 2 }
    ]);
    expect(encounterTemplate.isBoss).toBe(false);
  });

  it('should handle boss encounters correctly', () => {
    const encounterTemplate = new EncounterTemplate({
      id: 2,
      name: 'Dragon Fight',
      enemies: [
        { npc_template_id: 3, position: 0 }
      ],
      is_boss: true
    });

    expect(encounterTemplate.id).toBe(2);
    expect(encounterTemplate.name).toBe('Dragon Fight');
    expect(encounterTemplate.enemies).toEqual([
      { npc_template_id: 3, position: 0 }
    ]);
    expect(encounterTemplate.isBoss).toBe(true);
  });

  it('should handle an empty enemies array correctly', () => {
    const encounterTemplate = new EncounterTemplate({
      id: 3,
      name: 'Empty Encounter',
      enemies: [],
      is_boss: false
    });

    expect(encounterTemplate.id).toBe(3);
    expect(encounterTemplate.name).toBe('Empty Encounter');
    expect(encounterTemplate.enemies).toEqual([]);
    expect(encounterTemplate.isBoss).toBe(false);
  });
});
