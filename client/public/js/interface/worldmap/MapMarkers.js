// interface/worldmap/MapMarkers.js

// Example of each marker type
// const mapMarkers = [
//     { x: 100, y: 150, type: 'green', text: 'Normal Zone', sceneKey: 'NormalZoneScene' },
//     { x: 300, y: 200, type: 'blue', text: 'Town', sceneKey: 'TownScene' },
//     { x: 500, y: 400, type: 'red', text: 'Dungeon', sceneKey: 'DungeonScene' },
//     // Add more markers as needed
// ];

// interface/worldmap/MapMarkers.js
const mapMarkers = [
    // Towns
    { x: 539, y: 475, type: 'blue', text: 'Eldergrove', sceneKey: 'EldergroveTownScene', characterUnlockFlag: 1, characterClearFlag: null },
    { x: 606, y: 418, type: 'blue', text: 'Tilford', sceneKey: 'TilfordExterior1Scene', characterUnlockFlag: 2, characterClearFlag: null },
    { x: 397, y: 348, type: 'blue', text: 'Harborview', sceneKey: 'HarborviewExterior1Scene', characterUnlockFlag: 3, characterClearFlag: null },
    { x: 302, y: 300, type: 'blue', text: 'Blackwood', sceneKey: 'BlackwoodExterior1Scene', characterUnlockFlag: 4, characterClearFlag: null },
    { x: 758, y: 310, type: 'blue', text: 'Frostholm', sceneKey: 'FrostholmExterior1Scene', characterUnlockFlag: 5, characterClearFlag: null },
    { x: 246, y: 200, type: 'blue', text: 'Greenhaven', sceneKey: 'GreenhavenExterior1Scene', characterUnlockFlag: 6, characterClearFlag: null },
    { x: 639, y: 226, type: 'blue', text: "Glacier's Edge", sceneKey: 'GlaciersedgeExterior1Scene', characterUnlockFlag: 7, characterClearFlag: null },
    { x: 304, y: 87, type: 'blue', text: "Eagle's Hollow", sceneKey: 'EagleshollowExterior1Scene', characterUnlockFlag: 8, characterClearFlag: null },
    // Normal Zones
    { x: 548, y: 453, type: 'green', text: "Elder's Wood", sceneKey: 'r1z1', characterUnlockFlag: 9, characterClearFlag: 7779 },
    { x: 570, y: 429, type: 'green', text: 'Tilford Crossroad', sceneKey: 'r1z2', characterUnlockFlag: 10, characterClearFlag: 77710 },
    { x: 651, y: 422, type: 'green', text: 'Abandoned Fields', sceneKey: 'r1z3', characterUnlockFlag: 11, characterClearFlag: 77711 },
    { x: 693, y: 425, type: 'green', text: "Tilara's Wood", sceneKey: 'r1z4', characterUnlockFlag: 12, characterClearFlag: 77712 },
    { x: 527, y: 418, type: 'green', text: 'Menin Swamp', sceneKey: 'r1z5', characterUnlockFlag: 13, characterClearFlag: 77713 },
    { x: 473, y: 389, type: 'green', text: "Menin's Crossing", sceneKey: 'r1z6', characterUnlockFlag: 14, characterClearFlag: 77714 },
    { x: 501, y: 371, type: 'green', text: 'Darkwood Outskirts', sceneKey: 'r1z7', characterUnlockFlag: 15, characterClearFlag: 77715 },
    { x: 432, y: 400, type: 'green', text: 'Three Rivers', sceneKey: 'r1z8', characterUnlockFlag: 16, characterClearFlag: 77716 },
    { x: 398, y: 442, type: 'green', text: "Ferin's Pass", sceneKey: 'r1z9', characterUnlockFlag: 17, characterClearFlag: 77717 },
    { x: 405, y: 382, type: 'green', text: 'Harbor Road', sceneKey: 'r1z10', characterUnlockFlag: 18, characterClearFlag: 77718 }
];

const indexFromSceneKey = (sceneKey) => {
    const returnIndex = mapMarkers.findIndex(marker => marker.sceneKey === sceneKey);
    if (returnIndex === -1) {
        return 0;
    } else {
        return returnIndex;
    }
};

export { mapMarkers, indexFromSceneKey };