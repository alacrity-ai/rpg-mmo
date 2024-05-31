// const { mapCoordinatesToAreas, mapAreasToCoordinates } = require('../services/areas/mapFunctions');

// // const inputCoordinates = {
// //     '1': { x: 0, y: 0, type: 'entrance' },
// //     '2': { x: 0, y: 1, type: 'area' },
// //     '3': { x: 0, y: 2, type: 'area' },
// //     '4': { x: 1, y: 2, type: 'area' },
// //     '5': { x: 1, y: 3, type: 'exit' },
// //     '6': { x: 0, y: -1, type: 'area' },
// //     '7': { x: 0, y: -2, type: 'area' },
// //     '8': { x: 1, y: -2, type: 'area' }
// // };

// const inputCoordinates = {
//     '1': { x: 0, y: 5, type: 'entrance' },
//     '2': { x: 0, y: 4, type: 'area' },
//     '3': { x: 0, y: 3, type: 'area' },
//     '4': { x: 1, y: 3, type: 'area' },
//     '5': { x: 2, y: 3, type: 'area' },
//     '6': { x: 3, y: 3, type: 'area' },
//     '7': { x: 3, y: 4, type: 'area' },
//     '8': { x: 2, y: 4, type: 'area' },
//     '9': { x: 1, y: 4, type: 'exit' }
// };

// const inputAreas = {
//     1: { north: 2, south: 6, east: null, west: null, type: 'entrance' },
//     2: { north: 3, south: 1, east: null, west: null, type: 'area' },
//     3: { north: null, south: 2, east: 4, west: null, type: 'area' },
//     4: { north: 5, south: null, east: null, west: 3, type: 'area' },
//     5: { north: null, south: 4, east: null, west: null, type: 'exit' },
//     6: { north: 1, south: 7, east: null, west: null, type: 'area' },
//     7: { north: 6, south: null, east: 8, west: null, type: 'area' },
//     8: { north: null, south: null, east: null, west: 7, type: 'area' }
// };

// console.log(mapCoordinatesToAreas(inputCoordinates));
// console.log(mapAreasToCoordinates(inputAreas));

// testCreateExpeditionZone.js
const { createExpeditionZone } = require('../services/expeditions/zoneCreator');

// Replace with a valid templateId from your database
const templateId = 3;

async function testCreateExpeditionZone() {
  try {
    const zoneInstance = await createExpeditionZone(templateId);
  } catch (error) {
    console.error('Error creating expedition zone:', error);
  }
}

testCreateExpeditionZone();
