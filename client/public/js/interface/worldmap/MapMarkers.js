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
    { x: 397, y: 352, type: 'blue', text: 'Harborview', sceneKey: 'HarborviewExterior1Scene', characterUnlockFlag: 3, characterClearFlag: null },
    { x: 302, y: 300, type: 'blue', text: 'Blackwood', sceneKey: 'BlackwoodExterior1Scene', characterUnlockFlag: 4, characterClearFlag: null },
    { x: 758, y: 310, type: 'blue', text: 'Frostholm', sceneKey: 'FrostholmExterior1Scene', characterUnlockFlag: 5, characterClearFlag: null },
    { x: 246, y: 200, type: 'blue', text: 'Greenhaven', sceneKey: 'GreenhavenExterior1Scene', characterUnlockFlag: 6, characterClearFlag: null },
    { x: 639, y: 226, type: 'blue', text: "Glacier's Edge", sceneKey: 'GlaciersedgeExterior1Scene', characterUnlockFlag: 7, characterClearFlag: null },
    { x: 304, y: 87, type: 'blue', text: "Eagle's Hollow", sceneKey: 'EagleshollowExterior1Scene', characterUnlockFlag: 8, characterClearFlag: null },
    // Normal Zones
    { x: 548, y: 453, type: 'green', text: "Elder's Wood", sceneKey: 'EldersWood', characterUnlockFlag: 9, characterClearFlag: 7779 },
    { x: 570, y: 429, type: 'green', text: 'Tilford Crossroad', sceneKey: 'TilfordCrossroad', characterUnlockFlag: 10, characterClearFlag: 77710 },
    { x: 651, y: 430, type: 'green', text: 'Abandoned Fields', sceneKey: 'AbandonedFields', characterUnlockFlag: 11, characterClearFlag: 77711 },
    { x: 693, y: 425, type: 'green', text: "Tilara's Wood", sceneKey: 'TilarasWood', characterUnlockFlag: 12, characterClearFlag: 77712 },
    { x: 527, y: 418, type: 'green', text: 'Menin Swamp', sceneKey: 'MeninSwamp', characterUnlockFlag: 13, characterClearFlag: 77713 },
    { x: 475, y: 395, type: 'green', text: "Menin Crossing", sceneKey: 'MeninCrossing', characterUnlockFlag: 14, characterClearFlag: 77714 },
    { x: 501, y: 371, type: 'green', text: 'Dreadwood Outskirts', sceneKey: 'DreadwoodOutskirts', characterUnlockFlag: 15, characterClearFlag: 77715 },
    { x: 435, y: 405, type: 'green', text: 'Three Rivers', sceneKey: 'ThreeRivers', characterUnlockFlag: 16, characterClearFlag: 77716 },
    { x: 438, y: 436, type: 'green', text: "Stormreach Pass", sceneKey: 'StormreachPass', characterUnlockFlag: 17, characterClearFlag: 77717 },
    { x: 405, y: 388, type: 'green', text: 'Harbor Road', sceneKey: 'HarborRoad', characterUnlockFlag: 18, characterClearFlag: 77718 },
    { x: 402, y: 454, type: 'green', text: 'Stormreach Approach', sceneKey: 'StormreachApproach', characterUnlockFlag: 19, characterClearFlag: 77719 },
    { x: 500, y: 474, type: 'green', text: 'Hunting Grounds', sceneKey: 'HuntingGrounds', characterUnlockFlag: 20, characterClearFlag: 77720 },
    { x: 445, y: 345, type: 'green', text: 'The Trade Road', sceneKey: 'TheTradeRoad', characterUnlockFlag: 26, characterClearFlag: 77726},
    // Dungeons
    { x: 534, y: 346, type: 'red', text: 'The Dreadwood', sceneKey: 'd1', characterUnlockFlag: 21, characterClearFlag: 77721 },
    { x: 726, y: 429, type: 'red', text: 'Tilford Barracks', sceneKey: 'd2', characterUnlockFlag: 22, characterClearFlag: 77722 },
    { x: 360, y: 456, type: 'red', text: 'Stormreach', sceneKey: 'd3', characterUnlockFlag: 23, characterClearFlag: 77723 },
    { x: 440, y: 318, type: 'red', text: "Calum's Cave", sceneKey: 'd4', characterUnlockFlag: 24, characterClearFlag: 77724 },
    { x: 771, y: 456, type: 'red', text: "Tilford Manor", sceneKey: 'd5', characterUnlockFlag: 25, characterClearFlag: 77725 },
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