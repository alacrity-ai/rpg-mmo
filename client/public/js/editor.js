import { ZoneEditor } from './editor/zoneEditor.js';

document.addEventListener('DOMContentLoaded', () => {
  const editorDiv = document.getElementById('editor-container');
  const zoneEditor = new ZoneEditor(editorDiv);

  const newZoneButton = document.getElementById('new-zone-btn');
  const loadZoneButton = document.getElementById('load-zone-btn');
  const saveZoneButton = document.getElementById('save-zone-btn');

  newZoneButton.addEventListener('click', () => {
    zoneEditor.initializeNewZone();
  });

  loadZoneButton.addEventListener('click', () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const zoneData = JSON.parse(e.target.result);
          zoneEditor.loadZoneFromFile(zoneData);
        };
        reader.readAsText(file);
      }
    };
    fileInput.click();
  });

  saveZoneButton.addEventListener('click', () => {
    zoneEditor.saveZoneToFile();
  });
});
