const { getNpcDialogueInstanceByCharacterAndTemplate, createNpcDialogueInstance } = require('../../db/queries/npcDialogueInstancesQueries');
const { getNpcDialogueTemplateById } = require('../../db/queries/npcDialogueTemplatesQueries');
const { getNPCTemplateById } = require('../../db/queries/npcTemplatesQueries');

async function handleDialogue(characterId, npcTemplateId, action) {
  let dialogueInstance = await getNpcDialogueInstanceByCharacterAndTemplate(characterId, npcTemplateId);

  if (!dialogueInstance) {
    const dialogueTemplateId = (await getNPCTemplateById(npcTemplateId)).npc_dialogue_template_id;
    dialogueInstance = await createNpcDialogueInstance(dialogueTemplateId, characterId);
  }

  if (dialogueInstance) {
    const dialogueTemplate = await getNpcDialogueTemplateById(dialogueInstance.npcDialogueTemplateId);
    const DialogueClass = require(`./services/dialogues/${dialogueTemplate.script_path}`);
    const dialogue = new DialogueClass(dialogueInstance);

    await dialogue.handleState(action);
    const dialogueText = await dialogue.getDialogueText();

    console.log(dialogueText);
    return dialogueText;
  } else {
    throw new Error('Failed to create or retrieve dialogue instance.');
  }
}

handleDialogue(1, 1, 'ask_for_gear')
  .then(text => console.log('Dialogue:', text))
  .catch(err => console.error(err));
