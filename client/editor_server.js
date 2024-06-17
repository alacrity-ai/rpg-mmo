const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 8001;

// Enable CORS for all routes
app.use(cors());
app.use(express.json()); // For parsing application/json

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

// API endpoint to get a map of editor.png files and their folder paths
app.get('/api/npc-images', (req, res) => {
  const directoryPath = path.join(__dirname, 'public/assets/images/npcs');
  const results = getEditorPngMap(directoryPath, directoryPath);

  res.json(results);
});

// API endpoint to get a list of all .mp3 files in public/assets/music/zones
app.get('/api/music/zones', (req, res) => {
  const directoryPath = path.join(__dirname, 'public/assets/music/zones');

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res.status(500).send('Unable to scan directory: ' + err);
    }

    const mp3Files = files.filter(file => path.extname(file).toLowerCase() === '.mp3');
    const paths = mp3Files.map(file => `assets/music/zones/${file}`);
    res.json(paths);
  });
});

// API endpoint to get a list of all ambient sounds in public/assets/sounds/ambient
app.get('/api/sounds/ambient', (req, res) => {
  const directoryPath = path.join(__dirname, 'public/assets/sounds/ambient');

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res.status(500).send('Unable to scan directory: ' + err);
    }

    const soundFiles = files.filter(file => ['.mp3', '.wav'].includes(path.extname(file).toLowerCase()));
    const paths = soundFiles.map(file => `assets/sounds/ambient/${file}`);
    res.json(paths);
  });
});

// Catch-all route for serving the main HTML file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/editor.html'));
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

app.listen(PORT, () => {
  console.log(`Client server is running on port ${PORT}`);
});
