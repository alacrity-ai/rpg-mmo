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
   * @param {boolean} [params.encounter_cleared] - Whether the encounter has been cleared.
   * @param {Object} params.friendlyNpcs - A map of friendly NPC template IDs to their quantities.
   * @param {boolean} [params.explored] - Whether the area has been explored.
   * @param {number} [params.event_instance_id] - The ID of the event instance associated with the area.
   * @param {Date} params.created_at - The timestamp when the area instance was created.
   */
  constructor({ id, background_image, encounter = null, encounter_cleared = false, friendlyNpcs, explored = false, event_instance_id = null, created_at }) {
    this.id = id;
    this.background_image = background_image;
    this.encounter = encounter;
    this.encounter_cleared = !!encounter_cleared;  // Ensure boolean value
    this.friendlyNpcs = friendlyNpcs;
    this.explored = !!explored;  // Ensure boolean value
    this.event_instance_id = event_instance_id;
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
 *   encounter_cleared: false,
 *   friendlyNpcs: { 201: 1 },
 *   explored: false,
 *   event_instance_id: 1,
 *   created_at: new Date()
 * });
 *
 * console.log(areaInstance);
 * // AreaInstance {
 * //   id: 1,
 * //   background_image: 'forest.png',
 * //   encounter: 1,
 * //   encounter_cleared: false,
 * //   friendlyNpcs: { 201: 1 },
 * //   explored: false,
 * //   event_instance_id: 1,
 * //   created_at: 2024-05-30T12:34:56.789Z
 * // }
 */
