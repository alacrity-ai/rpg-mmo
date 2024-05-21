/**
 * Class representing a status template.
 */
class StatusTemplate {
    /**
     * Create a status template.
     * @param {Object} params - The parameters for creating a status template.
     * @param {number} params.id - The ID of the status template.
     * @param {string} params.name - The name of the status effect.
     * @param {string} params.description - The description of the status effect.
     * @param {string} params.effect_type - The type of the status effect (buff or debuff).
     * @param {Object} params.effect_details - The details of the effect.
     */
    constructor({ id, name, description, effect_type, effect_details }) {
      this.id = id;
      this.name = name;
      this.description = description;
      this.effectType = effect_type;
      this.effectDetails = effect_details;
    }
  }
  
module.exports = StatusTemplate;

/**
 * Example usage:
 * 
 * const statusTemplate = new StatusTemplate({
 *   id: 1,
 *   name: 'Poison',
 *   description: 'Reduces health over time.',
 *   effectType: 'debuff',
 *   effectDetails: { health_reduction: 5, duration: 10 }
 * });
 * 
 * console.log(statusTemplate);
 * // StatusTemplate {
 * //   id: 1,
 * //   name: 'Poison',
 * //   description: 'Reduces health over time.',
 * //   effectType: 'debuff',
 * //   effectDetails: { health_reduction: 5, duration: 10 }
 * // }
 */
