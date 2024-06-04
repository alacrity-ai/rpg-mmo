// models/AbilityTemplate.js

/**
 * Class representing an ability template.
 */
class AbilityTemplate {
    /**
     * Create an ability template.
     * @param {Object} params - The parameters for creating an ability template.
     * @param {number} params.id - The ID of the ability.
     * @param {string} params.name - The name of the ability.
     * @param {string} params.short_name - The short name of the ability.
     * @param {string} params.description - The description of the ability.
     * @param {string} params.type - The type of the ability (spell, ability, attack).
     * @param {number} params.potency - The power level of the ability.
     * @param {number} params.cost - The mana cost of the ability.
     * @param {string} params.target_team - The target team (friendly, hostile).
     * @param {string} params.target_type - The target type (target, area, relative, self).
     * @param {Object} params.target_area - The target area coordinates.
     * @param {string} params.cooldown_duration - The cooldown duration (minimum, short, normal, long).
     * @param {string} params.icon_name - The path to the icon of the ability.
     * @param {string} params.sound_path - The path to the sound effect of the ability.
     */
    constructor({ id, name, short_name, description, type, potency, cost, target_team, target_type, target_area, cooldown_duration, icon_name, sound_path }) {
      this.id = id;
      this.name = name;
      this.shortName = short_name;
      this.description = description;
      this.type = type;
      this.potency = potency;
      this.cost = cost;
      this.targetTeam = target_team;
      this.targetType = target_type;
      this.targetArea = target_area;
      this.cooldownDuration = cooldown_duration;
      this.iconName = icon_name;
      this.soundPath = sound_path;
    }
  }
  
  module.exports = AbilityTemplate;
  
  /**
   * Example usage:
   *
   * const ability = new AbilityTemplate({
   *   id: 1,
   *   name: 'Fireball',
   *   short_name: 'fireball',
   *   description: 'A powerful fire attack.',
   *   type: 'spell',
   *   potency: 100,
   *   cost: 50,
   *   target_team: 'hostile',
   *   target_type: 'area',
   *   target_area: [[0, 0], [0, 1], [0, 2]],
   *   cooldown_duration: 'normal',
   *   icon_name: 'fireball-icon',
   *   sound_path: 'path/to/fireball_sound.wav'
   * });
   */
  