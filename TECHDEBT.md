# TECH DEBT

## Battle Cleanup
- Cleanup a battle if all players disconnect.
    - logoutCleanup.js, needs to check if no players in a battle, and delete it
    - scriptTasks.js needs to not queue the next action if the battle no longer exists

## Movement Bug
If you use an ability, and then immediately move it is allowed.
We need to make sure that the ability cooldown also enforces movement.

## Template Ids
A lot of dependencies in the code on ids of templates.
E.g. in ZoneTemplate we reference Encounter Template Ids (as encounter_id) e.g.:
```
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
 *   ambient_sound_path: 'assets/sounds/forest_ambient1.mp3',
 *   environment_effects: {
 *     fog: {
 *       intensity: 0.8,
 *       speed: 0.5
 *     }
 *   }
 * });
 ```
 This means if we reinsert new templates and screw up the order of ids in the encounter_templates table, our zones may start giving us incorrect encounters.  We will need to:
- encounters column will need to expect a JSON list like [{'encounter_name': "someEncounter", probability: 0.5}]
- refactor services like the zoneCreator to use encounter names instead of getEncounterById