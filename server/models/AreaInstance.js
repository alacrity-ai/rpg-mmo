/**
 * Class representing an area instance.
 */
class AreaInstance {
    /**
     * Create an area instance.
     * @param {Object} params - The parameters for creating an area instance.
     * @param {number} params.id - The ID of the area instance.
     * @param {string} params.backgroundImage - The background image for the area instance.
     * @param {Object} params.hostileNpcs - A map of hostile NPC instance IDs to their quantities.
     * @param {Object} params.friendlyNpcs - A map of friendly NPC instance IDs to their quantities.
     */
    constructor({ id, background_image, hostileNpcs, friendlyNpcs }) {
      this.id = id;
      this.backgroundImage = background_image;
      this.hostileNpcs = hostileNpcs;
      this.friendlyNpcs = friendlyNpcs;
    }
  }
  
  module.exports = AreaInstance;
  
  /**
   * Example usage:
   * 
   * const areaInstance = new AreaInstance({
   *   id: 1,
   *   backgroundImage: 'forest.png',
   *   hostileNpcs: { 101: 3, 102: 1 },
   *   friendlyNpcs: { 201: 1 }
   * });
   * 
   * console.log(areaInstance);
   * // AreaInstance {
   * //   id: 1,
   * //   backgroundImage: 'forest.png',
   * //   hostileNpcs: { 101: 3, 102: 1 },
   * //   friendlyNpcs: { 201: 2 }
   * // }
   */
  