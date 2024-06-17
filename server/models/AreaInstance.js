/**
 * Class representing an area instance.
 */
class AreaInstance {
  /**
   * Create an area instance.
   * @param {Object} params - The parameters for creating an area instance.
   * @param {number} params.id - The ID of the area instance.
   * @param {string} params.zone_name - The name of the zone.
   * @param {number} params.zone_instance_id - The ID of the zone instance.
   * @param {number} params.zone_template_id - The ID of the zone template.
   * @param {string} params.music_path - The path to the music file.
   * @param {string} params.ambient_sound_path - The path to the ambient sound file.
   * @param {string} params.background_image - The background image for the area instance.
   * @param {Object} params.area_connections - A map of area connections.
   * @param {string} [params.encounter] - The name of the encounter associated with the area.
   * @param {boolean} [params.encounter_cleared] - Whether the encounter has been cleared.
   * @param {Object} params.friendly_npcs - A map of friendly NPC template IDs to their quantities.
   * @param {boolean} [params.explored] - Whether the area has been explored.
   * @param {number} [params.event_instance_id] - The ID of the event instance associated with the area.
   * @param {Object} [params.environment_effects] - The environmental effects for the area.
   * @param {Date} params.created_at - The timestamp when the area instance was created.
   */
  constructor({
    id,
    zone_name,
    zone_instance_id,
    zone_template_id,
    music_path,
    ambient_sound_path,
    background_image,
    area_connections,
    encounter = null,
    encounter_cleared = false,
    friendly_npcs,
    explored = false,
    event_instance_id = null,
    environment_effects = null,
    created_at
  }) {
    this.id = id;
    this.zoneName = zone_name;
    this.zoneInstanceId = zone_instance_id;
    this.zoneTemplateId = zone_template_id;
    this.musicPath = music_path;
    this.ambientSoundPath = ambient_sound_path;
    this.backgroundImage = background_image;
    this.areaConnections = area_connections;
    this.encounter = encounter;
    this.encounterCleared = !!encounter_cleared;  // Ensure boolean value
    this.friendlyNpcs = friendly_npcs;
    this.explored = !!explored;  // Ensure boolean value
    this.eventInstanceId = event_instance_id;
    this.environmentEffects = environment_effects;
    this.createdAt = created_at;
  }
}

module.exports = AreaInstance;

/**
 * Example usage:
 *
 * const areaInstance = new AreaInstance({
 *   id: 1,
 *   zone_name: 'Elder's Wood',
 *   zone_instance_id: 1,
 *   zone_template_id: 1,
 *   music_path: 'assets/audio/music/zones/elderswood.mp3',
 *   ambient_sound_path: 'assets/audio/ambient/elderswood.mp3',
 *   background_image: 'forest.png',
 *   area_connections: {
 *     1: { north: 2, south: null, east: 3, west: null, type: 'entrance' },
 *     2: { north: null, south: 1, east: 4, west: null, type: 'area' },
 *     3: { north: 4, south: null, east: null, west: 1, type: 'area' },
 *     4: { north: null, south: 3, east: null, west: 2, type: 'exit' }
 *   },
 *   encounter: "Goblin Ambush",
 *   encounter_cleared: false,
 *   friendlyNpcs: { 201: 1 },
 *   explored: false,
 *   event_instance_id: 1,
 *   environment_effects: {
 *     fog: {
 *       intensity: 0.8,
 *       speed: 0.5
 *     }
 *   },
 *   created_at: new Date()
 * });
 */
