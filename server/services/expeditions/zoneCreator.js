const { getZoneTemplateById, getZoneTemplateBySceneKey } = require('../../db/queries/zoneTemplatesQueries');
const { createZoneInstance } = require('../../db/queries/zoneInstancesQueries');
const { createAreaInstance, updateAreaInstancesWithZoneInstanceData } = require('../../db/queries/areaInstancesQueries');
const { createAreaEventInstance } = require('../../db/queries/areaEventInstancesQueries');
const { getEncounterTemplateById } = require('../../db/queries/encounterTemplatesQueries');
const { getRandomInt, getRandomFloat } = require('../../utilities/helpers');
const { generateGrid, mapCoordinatesToAreas } = require('./areas/mapFunctions');
const logger = require('../../utilities/logger');

async function createZoneInstanceFromTemplate(zoneTemplate) {
  try {
    if (!zoneTemplate) {
      throw new Error('Zone template not found');
    }
    const templateId = zoneTemplate.id;
    const numAreas = getRandomInt(zoneTemplate.minAreas, zoneTemplate.maxAreas);

    // Track used area events
    const usedAreaEvents = new Map();

    // Generate the area instances
    const areaInstances = [];
    let bossEncounterUsed = false;

    for (let i = 0; i < numAreas; i++) {
      // Create encounter and event instances for each area
      const areaInstanceData = {
        zone_name: zoneTemplate.name,
        zone_instance_id: null,
        zone_template_id: templateId,
        music_path: zoneTemplate.musicPath || null,
        ambient_sound_path: zoneTemplate.ambientSoundPath || null,
        background_image: `${zoneTemplate.imageFolderPath}/area_${i}.png`,
        area_connections: {},
        encounter: null,
        encounter_cleared: false,
        friendly_npcs: {},
        explored: false,
        environment_effects: zoneTemplate.environmentEffects || null,
        event_instance_id: null
      };
      
      if (i !== 0) {
        const encounterId = await generateEncounter(zoneTemplate.encounters, bossEncounterUsed);
        const encounterTemplate = encounterId ? await getEncounterTemplateById(encounterId) : null;
        if (encounterTemplate && encounterTemplate.isBoss) {
          bossEncounterUsed = true;
        }
        const eventInstanceId = await maybeCreateAreaEventInstance(zoneTemplate.areaEvents, usedAreaEvents);
        areaInstanceData.encounter = encounterId;
        areaInstanceData.event_instance_id = eventInstanceId;
        areaInstanceData.friendly_npcs = generateNpcs(zoneTemplate.friendlyNpcs);
      }
      
      // creaetAreaInstance will return the insert ID of the new area instance
      const areaInstance = await createAreaInstance(areaInstanceData);
      areaInstances.push(areaInstance);
    }

    // Create the zone instance
    const areaConnections = generateAreaConnections(areaInstances);
    const zoneInstance = await createZoneInstance({
      name: zoneTemplate.name,
      template_id: templateId,
      areas: areaConnections
    });

    // Update each area instance with the zone instance ID
    updateAreaInstancesWithZoneInstanceData(areaInstances, zoneInstance.id);
    return zoneInstance;
  } catch (error) {
    logger.error('Error creating zone instance:', error);
    throw error;
  }
}

async function maybeCreateAreaEventInstance(areaEvents, usedAreaEvents) {
    for (const event of areaEvents) {
      const { template_id, probability, max_instances } = event;
      const currentInstances = usedAreaEvents.get(template_id) || 0;
  
      if (currentInstances < max_instances && getRandomFloat(0, 1) <= probability) {
        const eventInstance = await createAreaEventInstance({
          template_id,
          phase: 1,
          action_votes: {},
          completed: false
        });
        usedAreaEvents.set(template_id, currentInstances + 1);
        return eventInstance.id;
      }
    }
    return null;
}

async function generateEncounter(encounters, bossEncounterUsed) {
  // Generate an encounter based on the provided encounter probabilities
  if (!encounters || encounters.length === 0) return null;

  const filteredEncounters = [];
  for (const encounter of encounters) {
    const encounterTemplate = await getEncounterTemplateById(encounter.encounter_id);
    if (!encounterTemplate.isBoss || !bossEncounterUsed) {
      filteredEncounters.push(encounter);
    }
  }

  if (filteredEncounters.length === 0) return null;

  const totalProbability = filteredEncounters.reduce((sum, encounter) => sum + encounter.probability, 0);

  // Allow for a chance of no encounter by including an empty encounter with the remaining probability
  const random = Math.random() * (totalProbability + (1 - totalProbability));
  let accumulatedProbability = 0;

  for (const encounter of filteredEncounters) {
    accumulatedProbability += encounter.probability;
    if (random <= accumulatedProbability) {
      return encounter.encounter_id;
    }
  }

  return null; // No encounter
}

function generateNpcs(npcTemplate) {
  // Generate NPC instances based on the template
  // This function can be customized to add logic for NPC generation
  return npcTemplate;
}

function generateAreaConnections(areaInstances) {
  // Generate a grid of areas
  const gridSize = 10; // Adjust grid size if needed
  const grid = generateGrid(areaInstances, gridSize);

  // Convert grid coordinates to area connections
  const areaConnections = mapCoordinatesToAreas(grid);
  return areaConnections;
}

async function createExpeditionZone(zoneTemplate) {
  try {
    const zoneInstance = await createZoneInstanceFromTemplate(zoneTemplate);
    logger.info('Zone instance created:', zoneInstance);
    return zoneInstance;
  } catch (error) {
    logger.error('Error creating expedition zone:', error);
    throw error;
  }
}

module.exports = {
  createZoneInstanceFromTemplate,
  createExpeditionZone
};
