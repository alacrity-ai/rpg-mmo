/**
 * Class representing a character party.
 */
class CharacterParty {
    /**
     * Create a character party.
     * @param {Object} params - The parameters for creating a character party.
     * @param {number} params.id - The ID of the party.
     * @param {Object[]} params.members - The members of the party, where each member is an object with user_id and character_id.
     */
    constructor({ id, members }) {
      this.id = id;
      this.members = members;
    }
  }
  
  /**
   * Example of how to instantiate the CharacterParty class.
   * @example
   * const party = new CharacterParty({
   *   id: 1,
   *   members: [
   *     { user_id: 1, character_id: 101 },
   *     { user_id: 2, character_id: 102 },
   *     { user_id: 3, character_id: 103 },
   *     { user_id: 4, character_id: 104 }
   *   ]
   * });
   * console.log(party);
   */
  
module.exports = CharacterParty;
  