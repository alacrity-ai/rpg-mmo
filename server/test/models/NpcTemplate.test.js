// test/models/NpcTemplate.test.js

const NpcTemplate = require('../../models/NpcTemplate');

describe('NpcTemplate', () => {
  it('should create an instance of NpcTemplate with correct properties', () => {
    const npcTemplate = new NpcTemplate({
      id: 1,
      name: 'Rat',
      sprite_key: 'rat_sprite',
      description: 'A small, skittish rodent.',
      script_path: 'scripts/rat_behavior.js',
      base_stats: { health: 20, mana: 0, strength: 3, stamina: 5, intelligence: 1 },
      loot_table: [
        { item_id: 1, chance_to_drop: 0.5 },
        { item_id: 7, chance_to_drop: 0.1 }
      ],
      npc_dialogue_template_id: null
    });

    expect(npcTemplate.id).toBe(1);
    expect(npcTemplate.name).toBe('Rat');
    expect(npcTemplate.spriteKey).toBe('rat_sprite');
    expect(npcTemplate.description).toBe('A small, skittish rodent.');
    expect(npcTemplate.scriptPath).toBe('scripts/rat_behavior.js');
    expect(npcTemplate.baseStats).toEqual({ health: 20, mana: 0, strength: 3, stamina: 5, intelligence: 1 });
    expect(npcTemplate.lootTable).toEqual([
      { item_id: 1, chance_to_drop: 0.5 },
      { item_id: 7, chance_to_drop: 0.1 }
    ]);
    expect(npcTemplate.npcDialogueTemplateId).toBeNull();
  });

  it('should handle NPCs with dialogue templates correctly', () => {
    const npcTemplate = new NpcTemplate({
      id: 2,
      name: 'Goblin',
      sprite_key: 'goblin_sprite',
      description: 'A small, green-skinned humanoid.',
      script_path: 'scripts/goblin_behavior.js',
      base_stats: { health: 30, mana: 10, strength: 8, stamina: 6, intelligence: 4 },
      loot_table: [
        { item_id: 2, chance_to_drop: 0.3 },
        { item_id: 8, chance_to_drop: 0.2 }
      ],
      npc_dialogue_template_id: 1
    });

    expect(npcTemplate.id).toBe(2);
    expect(npcTemplate.name).toBe('Goblin');
    expect(npcTemplate.spriteKey).toBe('goblin_sprite');
    expect(npcTemplate.description).toBe('A small, green-skinned humanoid.');
    expect(npcTemplate.scriptPath).toBe('scripts/goblin_behavior.js');
    expect(npcTemplate.baseStats).toEqual({ health: 30, mana: 10, strength: 8, stamina: 6, intelligence: 4 });
    expect(npcTemplate.lootTable).toEqual([
      { item_id: 2, chance_to_drop: 0.3 },
      { item_id: 8, chance_to_drop: 0.2 }
    ]);
    expect(npcTemplate.npcDialogueTemplateId).toBe(1);
  });

  it('should handle missing optional properties correctly', () => {
    const npcTemplate = new NpcTemplate({
      id: 3,
      name: 'Dragon',
      sprite_key: 'dragon_sprite',
      description: 'A large, fire-breathing reptile.',
      script_path: 'scripts/dragon_behavior.js',
      base_stats: { health: 200, mana: 100, strength: 50, stamina: 40, intelligence: 30 },
      loot_table: [
        { item_id: 3, chance_to_drop: 0.5 },
        { item_id: 9, chance_to_drop: 0.4 }
      ]
    });

    expect(npcTemplate.id).toBe(3);
    expect(npcTemplate.name).toBe('Dragon');
    expect(npcTemplate.spriteKey).toBe('dragon_sprite');
    expect(npcTemplate.description).toBe('A large, fire-breathing reptile.');
    expect(npcTemplate.scriptPath).toBe('scripts/dragon_behavior.js');
    expect(npcTemplate.baseStats).toEqual({ health: 200, mana: 100, strength: 50, stamina: 40, intelligence: 30 });
    expect(npcTemplate.lootTable).toEqual([
      { item_id: 3, chance_to_drop: 0.5 },
      { item_id: 9, chance_to_drop: 0.4 }
    ]);
    expect(npcTemplate.npcDialogueTemplateId).toBeNull();
  });
});
