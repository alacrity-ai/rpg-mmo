// models/ZoneTemplate.js

/**
 * Class representing a zone template.
 */
class ZoneTemplate {
  /**
   * Create a zone template.
   * @param {Object} params - The parameters for creating a zone template.
   * @param {number} params.id - The ID of the zone template.
   * @param {string} params.name - The name of the zone.
   * @param {string} params.scene_key - The scene key for the zone.
   * @param {string} params.description - The description of the zone.
   * @param {string} params.type - The type of the zone (normal, dungeon, raid, town).
   * @param {Array<Object>} params.encounters - An array of encounters in the zone.
   * @param {Array<Object>} params.friendly_npcs - An array of friendly NPCs in the zone.
   * @param {string} params.image_folder_path - The folder path for zone images.
   * @param {number} params.min_areas - The minimum number of areas in the zone.
   * @param {number} params.max_areas - The maximum number of areas in the zone.
   * @param {Array<Object>} params.area_events - An array of possible area events in the zone.
   * @param {string} params.music_path - The path for the zone's background music.
   * @param {string} params.ambient_sound_path - The path for the zone's ambient sound.
   */
  constructor({
    id,
    name,
    scene_key,
    description,
    type,
    encounters,
    friendly_npcs,
    image_folder_path,
    min_areas,
    max_areas,
    area_events,
    music_path,
    ambient_sound_path
  }) {
    this.id = id;
    this.name = name;
    this.sceneKey = scene_key;
    this.description = description;
    this.type = type;
    this.encounters = encounters;
    this.friendlyNpcs = friendly_npcs;
    this.imageFolderPath = image_folder_path;
    this.minAreas = min_areas;
    this.maxAreas = max_areas;
    this.areaEvents = area_events;
    this.musicPath = music_path;
    this.ambientSoundPath = ambient_sound_path;
  }
}

module.exports = ZoneTemplate;

/**
 * Example usage:
 *
 * const zoneTemplate = new ZoneTemplate({
 *   id: 1,
 *   name: 'Enchanted Forest',
 *   scene_key: 'forest_scene',
 *   description: 'A mystical forest filled with magical creatures and hidden secrets.',
 *   type: 'normal',
 *   encounters: [
 *     { encounter_id: 1, probability: 0.5 },
 *     { encounter_id: 2, probability: 0.1 }
 *   ],
 *   friendly_npcs: [
 *     { npc_id: 2, chance_to_spawn: 0.5, max_instances: 1 }
 *   ],
 *   image_folder_path: 'assets/images/zones/enchanted-forest',
 *   min_areas: 3,
 *   max_areas: 7,
 *   area_events: [
 *     { template_id: 1, probability: 0.2, max_instances: 2 },
 *     { template_id: 2, probability: 0.1, max_instances: 1 }
 *   ],
 *   music_path: 'assets/music/forest_music1.mp3',
 *   ambient_sound_path: 'assets/sounds/forest_ambient1.mp3'
 * });
 */
