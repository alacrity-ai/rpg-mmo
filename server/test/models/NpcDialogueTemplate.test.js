// test/models/NpcDialogueTemplate.test.js

const NpcDialogueTemplate = require('../../models/NpcDialogueTemplate');

describe('NpcDialogueTemplate', () => {
  it('should create an instance of NpcDialogueTemplate with correct properties', () => {
    const dialogueTemplate = new NpcDialogueTemplate({
      id: 1,
      description: 'Dialogue with the blacksmith',
      script_path: 'scripts/dialogue/blacksmith.js'
    });

    expect(dialogueTemplate.id).toBe(1);
    expect(dialogueTemplate.description).toBe('Dialogue with the blacksmith');
    expect(dialogueTemplate.scriptPath).toBe('scripts/dialogue/blacksmith.js');
  });

  it('should handle different script paths correctly', () => {
    const dialogueTemplate = new NpcDialogueTemplate({
      id: 2,
      description: 'Dialogue with the innkeeper',
      script_path: 'scripts/dialogue/innkeeper.js'
    });

    expect(dialogueTemplate.id).toBe(2);
    expect(dialogueTemplate.description).toBe('Dialogue with the innkeeper');
    expect(dialogueTemplate.scriptPath).toBe('scripts/dialogue/innkeeper.js');
  });

  it('should handle missing description property correctly', () => {
    const dialogueTemplate = new NpcDialogueTemplate({
      id: 3,
      description: '',
      script_path: 'scripts/dialogue/merchant.js'
    });

    expect(dialogueTemplate.id).toBe(3);
    expect(dialogueTemplate.description).toBe('');
    expect(dialogueTemplate.scriptPath).toBe('scripts/dialogue/merchant.js');
  });
});
