/**
 * Class representing a zone template.
 */
class ZoneTemplate {
    /**
     * Create a zone template.
     * @param {Object} params - The parameters for creating a zone template.
     * @param {number} params.id - The ID of the zone template.
     * @param {string} params.name - The name of the zone.
     * @param {string} params.description - The description of the zone.
     * @param {Array<Object>} params.hostileNpcs - An array of hostile NPCs in the zone.
     * @param {Array<Object>} params.friendlyNpcs - An array of friendly NPCs in the zone.
     * @param {string} params.imageFolderPath - The folder path for zone images.
     * @param {number} params.minAreas - The minimum number of areas in the zone.
     * @param {number} params.maxAreas - The maximum number of areas in the zone.
     * @param {string} params.musicKey - The key for the zone's background music.
     */
    constructor({ id, name, description, hostile_npcs, friendly_npcs, image_folder_path, min_areas, max_areas, music_key }) {
      this.id = id;
      this.name = name;
      this.description = description;
      this.hostileNpcs = hostile_npcs;
      this.friendlyNpcs = friendly_npcs;
      this.imageFolderPath = image_folder_path;
      this.minAreas = min_areas;
      this.maxAreas = max_areas;
      this.musicKey = music_key;
    }
  }
  
module.exports = ZoneTemplate;

/**
 * Example usage:
 * 
 * const zoneTemplate = new ZoneTemplate({
 *   id: 1,
 *   name: 'Enchanted Forest',
 *   description: 'A mystical forest filled with magical creatures and hidden secrets.',
 *   hostile_npcs: [
 *     { npc_id: 1, chance_to_spawn: 0.3, max_instances: 5 }, // Example: Rat
 *     { npc_id: 2, chance_to_spawn: 0.1, max_instances: 2 }  // Example: Donkey
 *   ],
 *   friendly_npcs: [
 *     { npc_id: 2, chance_to_spawn: 0.5, max_instances: 1 }  // Example: Donkey
 *   ],
 *   imageFolderPath: 'assets/images/zones/enchanted-forest',
 *   minAreas: 3,
 *   maxAreas: 7,
 *   musicKey: 'forest_music1'
 * });
 * 
 * console.log(zoneTemplate);
 * // ZoneTemplate {
 * //   id: 1,
 * //   name: 'Enchanted Forest',
 * //   description: 'A mystical forest filled with magical creatures and hidden secrets.',
 * //   hostileNpcs: [
 * //     { npc_id: 1, chance_to_spawn: 0.3, max_instances: 5 },
 * //     { npc_id: 2, chance_to_spawn: 0.1, max_instances: 2 }
 * //   ],
 * //   friendlyNpcs: [
 * //     { npc_id: 2, chance_to_spawn: 0.5, max_instances: 1 }
 * //   ],
 * //   imageFolderPath: 'assets/images/zones/enchanted-forest',
 * //   minAreas: 3,
 * //   maxAreas: 7,
 * //   musicKey: 'forest_music1'
 * // }
 * */
