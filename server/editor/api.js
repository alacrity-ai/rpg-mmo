const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const encounterJsonsPath = path.join(__dirname, '../db/data/encounter_jsons');
const enemyJsonsPath = path.join(__dirname, '../db/data/enemy_jsons');

// Helper function to read JSON files from a directory
const readJsonFiles = (directoryPath) => {
  const files = fs.readdirSync(directoryPath);
  return files.map(file => {
    const filePath = path.join(directoryPath, file);
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  });
};

// GET endpoint to get all JSON data from encounter_jsons folder
router.get('/encounters', (req, res) => {
  try {
    const encounterData = readJsonFiles(encounterJsonsPath);
    res.json(encounterData);
  } catch (error) {
    res.status(500).json({ error: 'Error reading encounter JSON files' });
  }
});

// GET endpoint to get all JSON data from enemy_jsons folder
router.get('/enemies', (req, res) => {
  try {
    const enemyData = readJsonFiles(enemyJsonsPath);
    res.json(enemyData);
  } catch (error) {
    res.status(500).json({ error: 'Error reading enemy JSON files' });
  }
});

// POST endpoint to create a new JSON file in encounter_jsons folder
router.post('/encounters', (req, res) => {
  const { filename, data } = req.body;
  if (!filename || !data) {
    return res.status(400).json({ error: 'Filename and data are required' });
  }
  const filePath = path.join(encounterJsonsPath, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  res.status(201).json({ message: 'File created successfully' });
});

// POST endpoint to create a new JSON file in enemy_jsons folder
router.post('/enemies', (req, res) => {
  const { filename, data } = req.body;
  if (!filename || !data) {
    return res.status(400).json({ error: 'Filename and data are required' });
  }
  const filePath = path.join(enemyJsonsPath, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  res.status(201).json({ message: 'File created successfully' });
});

module.exports = router;
