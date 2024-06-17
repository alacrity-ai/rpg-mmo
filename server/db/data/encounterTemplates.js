const fs = require('fs');
const path = require('path');

const encounterTemplates = [];
const encounterJsonsPath = path.join(__dirname, 'encounter_jsons');

// Read all JSON files in the encounter_jsons folder
fs.readdirSync(encounterJsonsPath).forEach(file => {
  if (path.extname(file) === '.json') {
    const filePath = path.join(encounterJsonsPath, file);
    const encounterData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Convert enemies to strings
    if (encounterData.enemies && typeof encounterData.enemies !== 'string') {
      encounterData.enemies = JSON.stringify(encounterData.enemies);
    }

    encounterTemplates.push(encounterData);
  }
});

module.exports = encounterTemplates;
