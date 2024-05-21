/**
 * Class representing a character's status.
 */
class CharacterStatus {
    /**
     * Create a character's status.
     * @param {Object} params - The parameters for creating a character's status.
     * @param {number} params.id - The ID of the character status.
     * @param {number} params.character_id - The ID of the character.
     * @param {Array<Object>} params.statuses - An array of status objects, each containing a status template ID and an applied timestamp.
     */
    constructor({ id, character_id, statuses }) {
      this.id = id;
      this.characterId = character_id;
      this.statuses = statuses;
    }
  }
  
  module.exports = CharacterStatus;
  
  /**
   * Example usage:
   * 
   * const characterStatus = new CharacterStatus({
   *   id: 1,
   *   character_id: 1,
   *   statuses: [
   *     { id: 101, applied_at: '2024-05-20T15:00:00Z' },
   *     { id: 102, applied_at: '2024-05-20T15:05:00Z' }
   *   ]
   * });
   * 
   * console.log(characterStatus);
   * // CharacterStatus {
   * //   id: 1,
   * //   characterId: 1,
   * //   statuses: [
   * //     { id: 101, applied_at: '2024-05-20T15:00:00Z' },
   * //     { id: 102, applied_at: '2024-05-20T15:05:00Z' }
   * //   ]
   * // }
   */
  