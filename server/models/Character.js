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
   * @param {Object} params.flags - An object representing the flags with key-value pairs.
   */
  constructor({ id, user_id, name, characterClass, baseStats, currentStats, current_area_id, flags }) {
    this.id = id;
    this.userId = user_id;
    this.name = name;
    this.characterClass = characterClass;
    this.baseStats = baseStats;
    this.currentStats = currentStats;
    this.currentAreaId = current_area_id;
    this.flags = flags;
  }
}

module.exports = Character;

/**
 * Example usage:
 *
 * const character = new Character({
 *   id: 1,
 *   user_id: 1,
 *   name: 'Thalion',
 *   characterClass: 'ranger',
 *   baseStats: { strength: 10, wisdom: 15, intelligence: 8, health: 100, mana: 50 },
 *   currentStats: { strength: 10, wisdom: 15, intelligence: 8, health: 100, mana: 50 },
 *   current_area_id: 1,
 *   flags: { Boss1: '1', QuestXYZProgress: '3', SwordofTruthQuest: '3' }
 * });
 */
