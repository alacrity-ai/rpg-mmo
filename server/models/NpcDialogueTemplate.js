// models/NpcDialogueTemplate.js

/**
 * Class representing an NPC dialogue template.
 */
class NpcDialogueTemplate {
    /**
     * Create an NPC dialogue template.
     * @param {Object} params - The parameters for creating an NPC dialogue template.
     * @param {number} params.id - The ID of the dialogue template.
     * @param {string} params.description - The description of the dialogue template.
     * @param {string} params.script_path - The script path for the dialogue template.
     */
    constructor({ id, description, script_path }) {
      this.id = id;
      this.description = description;
      this.scriptPath = script_path;
    }
  }
  
  module.exports = NpcDialogueTemplate;
  
  /**
   * Example usage:
   *
   * const dialogueTemplate = new NpcDialogueTemplate({
   *   id: 1,
   *   description: 'Dialogue with the blacksmith',
   *   script_path: 'scripts/dialogue/blacksmith.js'
   * });
   *
   * console.log(dialogueTemplate);
   * // NpcDialogueTemplate {
   * //   id: 1,
   * //   description: 'Dialogue with the blacksmith',
   * //   scriptPath: 'scripts/dialogue/blacksmith.js'
   * // }
   */
  