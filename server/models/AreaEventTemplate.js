// models/AreaEventTemplate.js

/**
 * Class representing an area event template.
 */
class AreaEventTemplate {
    /**
     * Create an area event template.
     * @param {Object} params - The parameters for creating an area event template.
     * @param {number} params.id - The ID of the event template.
     * @param {string} params.name - The name of the event.
     * @param {string} params.eventScript - The script that defines the logic and actions of the event.
     */
    constructor({ id, name, event_script }) {
      this.id = id;
      this.name = name;
      this.event_script = event_script;
    }
  }
  
module.exports = AreaEventTemplate;
  
  /**
   * Example usage:
   *
   * const areaEventTemplate = new AreaEventTemplate({
   *   id: 1,
   *   name: 'Mysterious Chest',
   *   event_script: 'services/areas/event_scripts/mysteriousChest.js'
   * });
   */
  