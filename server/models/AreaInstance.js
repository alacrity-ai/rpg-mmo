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
   * @param {Object} params.friendlyNpcs - A map of friendly NPC instance IDs to their quantities.
   * @param {Date} params.created_at - The timestamp when the area instance was created.
   */
  constructor({ id, background_image, encounter = null, friendlyNpcs, created_at }) {
    this.id = id;
    this.backgroundImage = background_image;
    this.encounter = encounter;
    this.friendlyNpcs = friendlyNpcs;
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
 *   created_at: new Date()
 * });
 *
 * console.log(areaInstance);
 * // AreaInstance {
 * //   id: 1,
 * //   backgroundImage: 'forest.png',
 * //   encounter: 1,
 * //   friendlyNpcs: { 201: 1 },
 * //   created_at: 2023-10-15T08:10:25.000Z
 * // }
 */
