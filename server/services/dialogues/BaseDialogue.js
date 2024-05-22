// services/dialogues/BaseDialogue.js

const { getNpcDialogueInstanceState, updateNpcDialogueInstanceState } = require('../../db/queries/npcDialogueInstancesQueries');
const { getCharacterById, addCharacterFlag, removeCharacterFlag } = require('../../db/queries/characterQueries');
const { getNPCTemplateById } = require('../../db/queries/npcTemplatesQueries');

class BaseDialogue {
  constructor(npcDialogueInstance) {
    this.npcDialogueInstance = npcDialogueInstance;
  }

  async transitionState(newState) {
    this.npcDialogueInstance.state = newState;
    await updateNpcDialogueInstanceState(this.npcDialogueInstance.id, newState);
  }

  async getDialogueText() {
    throw new Error("getDialogueText method should be overridden in the derived class");
  }

  async handleState(action) {
    throw new Error("handleState method should be overridden in the derived class");
  }

  async getCharacterById(characterId) {
    return await getCharacterById(characterId);
  }

  async getNpcById(npcId) {
    return await getNPCTemplateById(npcId);
  }

  async addCharacterFlag(flag) {
    return await addCharacterFlag(this.npcDialogueInstance.characterId, flag);
  }

  async removeCharacterFlag(flag) {
    return await removeCharacterFlag(this.npcDialogueInstance.characterId, flag);
  }

  async getCurrentState() {
    return await getNpcDialogueInstanceState(this.npcDialogueInstance.id);
  }
}

module.exports = BaseDialogue;
