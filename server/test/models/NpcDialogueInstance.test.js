// test/models/NpcDialogueInstance.test.js

const NpcDialogueInstance = require('../../models/NpcDialogueInstance');

describe('NpcDialogueInstance', () => {
  it('should create an instance of NpcDialogueInstance with correct properties', () => {
    const dialogueInstance = new NpcDialogueInstance({
      id: 1,
      npc_dialogue_template_id: 1,
      character_id: 1,
      state: 0
    });

    expect(dialogueInstance.id).toBe(1);
    expect(dialogueInstance.npcDialogueTemplateId).toBe(1);
    expect(dialogueInstance.characterId).toBe(1);
    expect(dialogueInstance.state).toBe(0);
  });

  it('should handle different states correctly', () => {
    const dialogueInstance = new NpcDialogueInstance({
      id: 2,
      npc_dialogue_template_id: 2,
      character_id: 2,
      state: 1
    });

    expect(dialogueInstance.id).toBe(2);
    expect(dialogueInstance.npcDialogueTemplateId).toBe(2);
    expect(dialogueInstance.characterId).toBe(2);
    expect(dialogueInstance.state).toBe(1);
  });

  it('should handle initial state correctly', () => {
    const dialogueInstance = new NpcDialogueInstance({
      id: 3,
      npc_dialogue_template_id: 3,
      character_id: 3,
      state: 0
    });

    expect(dialogueInstance.id).toBe(3);
    expect(dialogueInstance.npcDialogueTemplateId).toBe(3);
    expect(dialogueInstance.characterId).toBe(3);
    expect(dialogueInstance.state).toBe(0);
  });
});
