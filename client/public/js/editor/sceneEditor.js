// sceneEditor.js

import { toggleBackToZoneEditor } from './utils/sceneEditorToggles.js';
import { LightSource } from './sceneObjects/lightSource.js';
import { createLightSourcePopup } from './popups/lightSourceEditor.js';
import { renderScene } from './sceneObjects/renderScene.js';

export class SceneEditor {
  constructor(zoneData) {
    this.zoneData = zoneData;
    this.sceneId = null;
    this.editorDiv = document.getElementById('editor-container');
    this.sceneEditorDiv = document.createElement('div');
    this.sceneEditorDiv.id = 'scene-editor-container';
    this.sceneEditorDiv.style.display = 'none'; // Initially hidden
    document.getElementById('editor-root').appendChild(this.sceneEditorDiv);
    this.zoomControls = document.getElementById('zoom-controls');
    this.isLightSourceMode = false; // Track whether light source mode is active

    this.toggleBackToZoneEditor = toggleBackToZoneEditor.bind(this);
  }

  openLightSourceEditor(index) {
    const sceneData = this.zoneData.scenes[this.sceneId];
    const lightSource = sceneData.lightSources[index];
    createLightSourcePopup(lightSource, (updatedLightSource) => {
      sceneData.lightSources[index] = updatedLightSource;
      renderScene(sceneData, this.openLightSourceEditor.bind(this));
    });
  }

  toggleLightSourceMode(button) {
    this.isLightSourceMode = !this.isLightSourceMode;
    button.style.backgroundColor = this.isLightSourceMode ? '#ff0' : '#007bff';
  }

  handleSceneClick(event) {
    if (this.isLightSourceMode) {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = Math.min(Math.max(0, event.clientX - rect.left), 1000);
      const y = Math.min(Math.max(0, event.clientY - rect.top), 562);
      this.addLightSource(x, y);
    }
  }

  addLightSource(x, y) {
    const color = '#ffff00'; // Default color (yellow)
    const minRadius = 5; // Default min radius
    const maxRadius = 25; // Default max radius
    const pulseSpeed = 2; // Default pulse speed

    const newLightSource = new LightSource(x, y, color, minRadius, maxRadius, pulseSpeed);

    // Ensure the scene has a lightSources array
    const sceneData = this.zoneData.scenes[this.sceneId];
    if (!sceneData.lightSources) {
      sceneData.lightSources = [];
    }
    sceneData.lightSources.push(newLightSource);

    // Re-render the scene to include the new light source
    renderScene(sceneData, this.openLightSourceEditor.bind(this));
  }

  addNPC() {
    console.log('Add NPC functionality here.');
  }

  addEntrance() {
    console.log('Add entrance functionality here.');
  }

  deselectModes() {
    this.isLightSourceMode = false;
    const lightButton = document.getElementById('light-source-button');
    if (lightButton) lightButton.style.backgroundColor = '#007bff';
    console.log('Deselected all modes.');
  }
}
