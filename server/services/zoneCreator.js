const { getZoneTemplateById } = require('../db/queries/zoneTemplatesQueries');
const { createZoneInstance } = require('../db/queries/zoneInstancesQueries');
const { createAreaInstance } = require('../db/queries/areaInstancesQueries');
const { createAreaEventInstance } = require('../db/queries/areaEventInstancesQueries');
const { getEncounterTemplateById } = require('../db/queries/encounterTemplatesQueries');
const { getRandomInt, getRandomFloat } = require('../utilities/helpers');
const { generateGrid, mapCoordinatesToAreas } = require('./areas/mapFunctions');
const logger = require('../utilities/logger');

async function createZoneInstanceFromTemplate(templateId, params = {}) {
    try {
      // Fetch the zone template
      const zoneTemplate = await getZoneTemplateById(templateId);
      if (!zoneTemplate) {
        throw new Error('Zone template not found');
      }
  
      // Determine the number of areas to create
      const numAreas = getRandomInt(zoneTemplate.minAreas, zoneTemplate.maxAreas);
  
      // Track used area events
      const usedAreaEvents = new Map();
  
      // Generate the area instances
      const areaInstances = [];
      let bossEncounterUsed = false;
  
      for (let i = 0; i < numAreas; i++) {
        const encounterId = await generateEncounter(zoneTemplate.encounters, bossEncounterUsed);
        const encounterTemplate = encounterId ? await getEncounterTemplateById(encounterId) : null;
  
        if (encounterTemplate && encounterTemplate.isBoss) {
          bossEncounterUsed = true;
        }
  
        const eventInstanceId = await maybeCreateAreaEventInstance(zoneTemplate.areaEvents, usedAreaEvents);
  
        const areaInstance = await createAreaInstance({
          background_image: `${zoneTemplate.imageFolderPath}/area_${i}.png`,
          encounter: encounterId,
          friendlyNpcs: generateNpcs(zoneTemplate.friendlyNpcs),
          event_instance_id: eventInstanceId
        });
        areaInstances.push(areaInstance);
      }
  
      // Create the zone instance
      const areaConnections = generateAreaConnections(numAreas);
      const zoneInstance = await createZoneInstance({
        name: params.name || zoneTemplate.name,
        template_id: templateId,
        areas: areaConnections
      });
  
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

function generateAreaConnections(numAreas) {
  // Generate a grid of areas
  const gridSize = 10; // Adjust grid size if needed
  const grid = generateGrid(numAreas, numAreas, gridSize);

  // Convert grid coordinates to area connections
  const areaConnections = mapCoordinatesToAreas(grid);
  return areaConnections;
}

async function createExpeditionZone(templateId, params) {
  try {
    const zoneInstance = await createZoneInstanceFromTemplate(templateId, params);
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
