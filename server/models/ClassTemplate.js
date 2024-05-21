/**
 * Class representing a class template.
 */
class ClassTemplate {
    /**
     * Create a class template.
     * @param {Object} params - The parameters for creating a class template.
     * @param {number} params.id - The ID of the class template.
     * @param {string} params.name - The name of the class.
     * @param {Object} params.baseStats - The base stats of the class.
     * @param {Object} params.statLevelScaling - The stat level scaling multipliers of the class.
     * @param {string} params.description - The description of the class.
     */
    constructor({ id, name, base_stats, stat_level_scaling, description }) {
      this.id = id;
      this.name = name;
      this.baseStats = base_stats;
      this.statLevelScaling = stat_level_scaling;
      this.description = description;
    }
  }
  
  module.exports = ClassTemplate;
  
  /**
   * Example usage:
   * 
   * const classTemplate = new ClassTemplate({
   *   id: 1,
   *   name: 'rogue',
   *   base_stats: {
   *     strength: 5,
   *     stamina: 3,
   *     intelligence: 2
   *   },
   *   stat_level_scaling: {
   *     strength: 1.2,
   *     stamina: 1.1,
   *     intelligence: 1.0
   *   },
   *   description: 'A stealthy and agile fighter, adept at avoiding detection and striking from the shadows.'
   * });
   * 
   * console.log(classTemplate);
   * // ClassTemplate {
   * //   id: 1,
   * //   name: 'rogue',
   * //   baseStats: { strength: 5, stamina: 3, intelligence: 2 },
   * //   statLevelScaling: { strength: 1.2, stamina: 1.1, intelligence: 1.0 },
   * //   description: 'A stealthy and agile fighter, adept at avoiding detection and striking from the shadows.'
   * // }
   */
  