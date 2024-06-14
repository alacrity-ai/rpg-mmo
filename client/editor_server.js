const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // Import cors

const app = express();
const PORT = 8001;

// Enable CORS for all routes
app.use(cors());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to get zone types
app.get('/api/zone-types', (req, res) => {
  const directoryPath = path.join(__dirname, 'public/assets/images/zone/area/normal');

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res.status(500).send('Unable to scan directory: ' + err);
    }

    const directories = files.filter(file => fs.lstatSync(path.join(directoryPath, file)).isDirectory());
    res.json(directories);
  });
});

// API endpoint to get PNG files in a specific zone type directory
app.get('/api/zone-images/:zoneType', (req, res) => {
  const zoneType = req.params.zoneType;
  const directoryPath = path.join(__dirname, `public/assets/images/zone/area/normal/${zoneType}`);

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res.status(500).send('Unable to scan directory: ' + err);
    }

    const pngFiles = files.filter(file => path.extname(file).toLowerCase() === '.png');
    res.json(pngFiles);
  });
});

// New API endpoint to get a map of editor.png files and their folder paths
app.get('/api/npc-images', (req, res) => {
  const directoryPath = path.join(__dirname, 'public/assets/images/npcs');
  const results = getEditorPngMap(directoryPath, directoryPath);

  res.json(results);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/editor.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Utility function to get the map of editor.png files and their folder paths
function getEditorPngMap(directory, basePath) {
  let results = {};

  fs.readdirSync(directory).forEach(file => {
    const fullPath = path.join(directory, file);
    const relativePath = path.relative(basePath, fullPath);
    const stat = fs.lstatSync(fullPath);

    if (stat.isDirectory()) {
      const subResults = getEditorPngMap(fullPath, basePath);
      results = { ...results, ...subResults };
    } else if (stat.isFile() && file === 'editor.png') {
      const folderPath = path.dirname(relativePath);
      results[relativePath.replace(/\\/g, '/')] = folderPath.replace(/\\/g, '/');
    }
  });

  return results;
}
