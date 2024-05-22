// models/NpcDialogueInstance.js

/**
 * Class representing an NPC dialogue instance.
 */
class NpcDialogueInstance {
    /**
     * Create an NPC dialogue instance.
     * @param {Object} params - The parameters for creating an NPC dialogue instance.
     * @param {number} params.id - The ID of the dialogue instance.
     * @param {number} params.npc_dialogue_template_id - The ID of the dialogue template.
     * @param {number} params.character_id - The ID of the character engaging in the conversation.
     * @param {number} params.state - The current state of the conversation.
     */
    constructor({ id, npc_dialogue_template_id, character_id, state }) {
      this.id = id;
      this.npcDialogueTemplateId = npc_dialogue_template_id;
      this.characterId = character_id;
      this.state = state;
    }
  }
  
  module.exports = NpcDialogueInstance;
  
  /**
   * Example usage:
   *
   * const dialogueInstance = new NpcDialogueInstance({
   *   id: 1,
   *   npc_dialogue_template_id: 1,
   *   character_id: 1,
   *   state: 0
   * });
   *
   * console.log(dialogueInstance);
   * // NpcDialogueInstance {
   * //   id: 1,
   * //   npcDialogueTemplateId: 1,
   * //   characterId: 1,
   * //   state: 0
   * // }
   */
  