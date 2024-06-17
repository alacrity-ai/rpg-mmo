// db/data/npcTemplates.js

const fs = require('fs');
const path = require('path');

const npcTemplates = [];
const enemyJsonsPath = path.join(__dirname, 'enemy_jsons');

console.log('enemyJsonsPath:', enemyJsonsPath);
// Read all JSON files in the enemy_jsons folder
fs.readdirSync(enemyJsonsPath).forEach(file => {
  if (path.extname(file) === '.json') {
    const filePath = path.join(enemyJsonsPath, file);
    const enemyData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Convert base_stats and loot_table to strings
    if (enemyData.base_stats && typeof enemyData.base_stats !== 'string') {
      enemyData.base_stats = JSON.stringify(enemyData.base_stats);
    }
    if (enemyData.loot_table && typeof enemyData.loot_table !== 'string') {
      enemyData.loot_table = JSON.stringify(enemyData.loot_table);
    }

    npcTemplates.push(enemyData);
  }
});

module.exports = npcTemplates;
