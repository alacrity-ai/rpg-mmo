// models/CharacterFlagTemplate.js

/**
 * Class representing a character flag template.
 */
class CharacterFlagTemplate {
    /**
     * Create a character flag template.
     * @param {Object} params - The parameters for creating a character flag template.
     * @param {number} params.id - The ID of the flag template.
     * @param {string} params.name - The name of the flag.
     * @param {string} params.description - The description of the flag.
     */
    constructor({ id, name, description = '' }) {
      this.id = id;
      this.name = name;
      this.description = description;
    }
  }
  
  module.exports = CharacterFlagTemplate;
  
  /**
   * Example usage:
   *
   * const flagTemplate = new CharacterFlagTemplate({
   *   id: 1,
   *   name: 'hasTalkedToBlacksmith',
   *   description: 'Indicates if the character has talked to the blacksmith.'
   * });
   *
   * console.log(flagTemplate);
   * // CharacterFlagTemplate {
   * //   id: 1,
   * //   name: 'hasTalkedToBlacksmith',
   * //   description: 'Indicates if the character has talked to the blacksmith.'
   * // }
   */
  