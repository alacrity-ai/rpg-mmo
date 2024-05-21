/**
 * Class representing a zone instance.
 */
class ZoneInstance {
    /**
     * Create a zone instance.
     * @param {Object} params - The parameters for creating a zone instance.
     * @param {number} params.id - The ID of the zone instance.
     * @param {string} params.name - The name of the zone instance.
     * @param {number} params.templateId - The ID of the zone template.
     * @param {Object} params.areas - A map of area instance IDs and their connections.
     */
    constructor({ id, name, template_id, areas }) {
      this.id = id;
      this.name = name;
      this.templateId = template_id;
      this.areas = areas;
    }
  }
  
module.exports = ZoneInstance;

/**
 * Example usage:
 * 
 * const zoneInstance = new ZoneInstance({
 *   id: 1,
 *   name: 'Forest Zone',
 *   template_id: 101,
 *   areas: {
 *     1: { north: 2, south: null, east: 3, west: null },
 *     2: { north: null, south: 1, east: 4, west: null },
 *     3: { north: 4, south: null, east: null, west: 1 },
 *     4: { north: null, south: 3, east: null, west: 2 }
 *   }
 * });
 * 
 * console.log(zoneInstance);
 * // ZoneInstance {
 * //   id: 1,
 * //   name: 'Forest Zone',
 * //   templateId: 101,
 * //   areas: {
 * //     1: { north: 2, south: null, east: 3, west: null },
 * //     2: { north: null, south: 1, east: 4, west: null },
 * //     3: { north: 4, south: null, east: null, west: 1 },
 * //     4: { north: null, south: 3, east: null, west: 2 }
 * //   }
 * // }
 */
