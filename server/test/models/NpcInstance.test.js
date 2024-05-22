// test/models/NpcInstance.test.js

const NpcInstance = require('../../models/NpcInstance');

describe('NpcInstance', () => {
  it('should create an instance of NpcInstance with correct properties', () => {
    const npcInstance = new NpcInstance({
      id: 1,
      npc_template_id: 101,
      current_area_id: 201,
      base_stats: { health: 20, mana: 10, strength: 5, stamina: 7, intelligence: 3 },
      current_stats: { health: 15, mana: 10, strength: 5, stamina: 7, intelligence: 3 },
      state: 'idle'
    });

    expect(npcInstance.id).toBe(1);
    expect(npcInstance.npcTemplateId).toBe(101);
    expect(npcInstance.currentAreaId).toBe(201);
    expect(npcInstance.baseStats).toEqual({ health: 20, mana: 10, strength: 5, stamina: 7, intelligence: 3 });
    expect(npcInstance.currentStats).toEqual({ health: 15, mana: 10, strength: 5, stamina: 7, intelligence: 3 });
    expect(npcInstance.state).toBe('idle');
  });

  it('should handle different states correctly', () => {
    const npcInstance = new NpcInstance({
      id: 2,
      npc_template_id: 102,
      current_area_id: 202,
      base_stats: { health: 25, mana: 15, strength: 10, stamina: 10, intelligence: 5 },
      current_stats: { health: 20, mana: 15, strength: 10, stamina: 10, intelligence: 5 },
      state: 'combat'
    });

    expect(npcInstance.id).toBe(2);
    expect(npcInstance.npcTemplateId).toBe(102);
    expect(npcInstance.currentAreaId).toBe(202);
    expect(npcInstance.baseStats).toEqual({ health: 25, mana: 15, strength: 10, stamina: 10, intelligence: 5 });
    expect(npcInstance.currentStats).toEqual({ health: 20, mana: 15, strength: 10, stamina: 10, intelligence: 5 });
    expect(npcInstance.state).toBe('combat');
  });

  it('should handle different NPC templates correctly', () => {
    const npcInstance = new NpcInstance({
      id: 3,
      npc_template_id: 103,
      current_area_id: 203,
      base_stats: { health: 30, mana: 20, strength: 15, stamina: 12, intelligence: 8 },
      current_stats: { health: 25, mana: 20, strength: 15, stamina: 12, intelligence: 8 },
      state: 'patrol'
    });

    expect(npcInstance.id).toBe(3);
    expect(npcInstance.npcTemplateId).toBe(103);
    expect(npcInstance.currentAreaId).toBe(203);
    expect(npcInstance.baseStats).toEqual({ health: 30, mana: 20, strength: 15, stamina: 12, intelligence: 8 });
    expect(npcInstance.currentStats).toEqual({ health: 25, mana: 20, strength: 15, stamina: 12, intelligence: 8 });
    expect(npcInstance.state).toBe('patrol');
  });
});
