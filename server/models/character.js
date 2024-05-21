// models/Character.js

/**
 * Class representing a character.
 */
class Character {
  /**
   * Create a character.
   * @param {Object} params - The parameters for creating a character.
   * @param {number} params.id - The ID of the character.
   * @param {number} params.user_id - The ID of the user who owns the character.
   * @param {string} params.name - The name of the character.
   * @param {string} params.characterClass - The class of the character.
   * @param {Object} params.baseStats - The base stats of the character.
   * @param {Object} params.currentStats - The current stats of the character.
   * @param {number} params.current_area_id - The ID of the current area the character is in.
   * @param {string} params.socket_id - The socket ID associated with the character.
   */
  constructor({ id, user_id, name, characterClass, baseStats, currentStats, current_area_id, socket_id }) {
    this.id = id;
    this.userId = user_id;
    this.name = name;
    this.characterClass = characterClass;
    this.baseStats = baseStats;
    this.currentStats = currentStats;
    this.currentAreaId = current_area_id;
    this.socketId = socket_id;
  }
}

module.exports = Character;
