// models/AreaInstance.js

/**
 * Class representing an area instance.
 */
class AreaInstance {
  /**
   * Create an area instance.
   * @param {Object} params - The parameters for creating an area instance.
   * @param {number} params.id - The ID of the area instance.
   * @param {string} params.backgroundImage - The background image for the area instance.
   * @param {number} [params.encounter] - The ID of the encounter associated with the area.
   * @param {Object} params.friendlyNpcs - A map of friendly NPC template IDs to their quantities.
   * @param {boolean} [params.explored] - Whether the area has been explored.
   * @param {Date} params.created_at - The timestamp when the area instance was created.
   */
  constructor({ id, background_image, encounter = null, friendlyNpcs, explored = false, created_at }) {
    this.id = id;
    this.background_image = background_image;
    this.encounter = encounter;
    this.friendlyNpcs = friendlyNpcs;
    this.explored = !!explored;  // Ensure boolean value
    this.created_at = created_at;
  }
}

module.exports = AreaInstance;

/**
 * Example usage:
 *
 * const areaInstance = new AreaInstance({
 *   id: 1,
 *   background_image: 'forest.png',
 *   encounter: 1,
 *   friendlyNpcs: { 201: 1 },
 *   explored: false,
 *   created_at: new Date()
 * });
 */
