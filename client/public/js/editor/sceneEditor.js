// sceneEditor.js

import { toggleBackToZoneEditor } from './utils/sceneEditorToggles.js';
import { LightSource } from './sceneObjects/lightSource.js';
import { createLightSourcePopup } from './popups/lightSourceEditor.js';
import { chooseNPC, updateSceneBoxNPC } from './utils/npcSelector.js';
import { NPC } from './sceneObjects/NpcObject.js';

let selectedNPCPath = null;


export class SceneEditor {
  constructor(zoneData) {
    this.zoneData = zoneData; // The same as the 'zone' object in the main editor
    this.sceneId = null;
    this.editorDiv = document.getElementById('editor-container');
    this.sceneEditorDiv = document.createElement('div');
    this.sceneEditorDiv.id = 'scene-editor-container';
    this.sceneEditorDiv.style.display = 'none'; // Initially hidden
    document.getElementById('editor-root').appendChild(this.sceneEditorDiv);
    this.zoomControls = document.getElementById('zoom-controls');
    this.isLightSourceMode = false; // Track whether light source mode is active
    this.isDeleteMode = false; // Track whether delete mode is active
    this.isNPCMode = false; // Track whether NPC mode is active
    this.selectedNPCPath = null; // Store the selected NPC path

    this.toggleBackToZoneEditor = toggleBackToZoneEditor.bind(this);
    this.handleSceneClick = this.handleSceneClick.bind(this); // Ensure handleSceneClick is properly bound
  }

  setActiveMode(mode) {
    // Deactivate all modes
    this.isLightSourceMode = false;
    this.isDeleteMode = false;
    this.isNPCMode = false;
    this.selectedNPCPath = null;

    // Reset all mode buttons' styles
    const lightButton = document.getElementById('light-source-button');
    const deleteButton = document.getElementById('trash-button');
    const npcButton = document.getElementById('npc-button');
    if (lightButton) lightButton.style.backgroundColor = '#007bff';
    if (deleteButton) deleteButton.style.backgroundColor = '#007bff';
    if (npcButton) npcButton.style.backgroundColor = '#007bff';

    // Activate the selected mode and update button style
    switch (mode) {
      case 'lightSource':
        this.isLightSourceMode = true;
        if (lightButton) lightButton.style.backgroundColor = '#ff0';
        break;
      case 'delete':
        this.isDeleteMode = true;
        if (deleteButton) deleteButton.style.backgroundColor = '#ff0';
        break;
      case 'npc':
        this.isNPCMode = true;
        if (npcButton) npcButton.style.backgroundColor = '#ff0';
        break;
      default:
        break;
    }
  }

  toggleLightSourceMode() {
    this.setActiveMode(this.isLightSourceMode ? null : 'lightSource');
  }

  toggleDeleteMode() {
    this.setActiveMode(this.isDeleteMode ? null : 'delete');
  }

  toggleNPCMode() {
    this.setActiveMode(this.isNPCMode ? null : 'npc');
  }

  renderScene(sceneData) {
    const sceneRenderContainer = document.getElementById('scene-render-container');
    sceneRenderContainer.innerHTML = ''; // Clear previous content

    if (sceneData.background) {
      const img = document.createElement('img');
      img.src = sceneData.background;
      img.style.position = 'absolute';
      img.style.width = '1000px';
      img.style.height = '562px';
      img.style.objectFit = 'cover'; // Maintain aspect ratio

      // Add event listener to prevent default behavior on left click and drag
      img.addEventListener('mousedown', (event) => {
        event.preventDefault();
      });

      sceneRenderContainer.appendChild(img);
    } else {
      sceneRenderContainer.style.backgroundColor = '#007bff';
      sceneRenderContainer.style.width = '1000px';
      sceneRenderContainer.style.height = '562px';
    }

    // Render light sources
    if (sceneData.lightSources) {
      sceneData.lightSources.forEach((lightSource, index) => {
        // Render the maxRadius circle
        const lightCircle = document.createElement('div');
        lightCircle.style.position = 'absolute';
        lightCircle.style.left = `${lightSource.x}px`;
        lightCircle.style.top = `${lightSource.y}px`;
        lightCircle.style.transform = 'translate(-50%, -50%)'; // Center the circle
        lightCircle.style.width = `${lightSource.radius * 2}px`;
        lightCircle.style.height = `${lightSource.radius * 2}px`;
        lightCircle.style.borderRadius = '50%'; // Make it a circle
        lightCircle.style.backgroundColor = lightSource.color;
        lightCircle.style.opacity = '0.3'; // Make it semi-transparent
        sceneRenderContainer.appendChild(lightCircle);

        // Render the lightbulb
        const lightbulb = document.createElement('div');
        lightbulb.textContent = '💡';
        lightbulb.style.position = 'absolute';
        lightbulb.style.left = `${lightSource.x}px`;
        lightbulb.style.top = `${lightSource.y}px`;
        lightbulb.style.transform = 'translate(-50%, -50%)'; // Center the lightbulb emoji
        lightbulb.style.cursor = 'pointer';
        lightbulb.style.color = 'transparent'; // Make the lightbulb emoji itself invisible
        lightbulb.style.textShadow = `${lightSource.color} 0 0 100px`; // Apply colored shadow with maxRadius

        lightbulb.addEventListener('click', (event) => {
          event.stopPropagation(); // Prevent triggering other click events
          if (this.isDeleteMode) {
            this.deleteLightSource(index);
          } else {
            this.openLightSourceEditor(index);
          }
        });
        sceneRenderContainer.appendChild(lightbulb);
      });
    }

    // Render NPCs
    if (sceneData.npcs) {
      sceneData.npcs.forEach((npc, index) => {
        const npcImage = document.createElement('img');
        npcImage.src = npc.path;
        npcImage.style.position = 'absolute';
        npcImage.style.left = `${npc.x - 85}px`; // Center horizontally
        npcImage.style.top = `${npc.y - 85}px`; // Center vertically
        npcImage.style.width = '170px';
        npcImage.style.height = '170px';
        npcImage.style.cursor = 'pointer';

        npcImage.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent triggering other click events
            if (this.isDeleteMode) {
              this.deleteNPC(index);
            } else {
              this.openLightSourceEditor(index);
            }
          });

        sceneRenderContainer.appendChild(npcImage);
      });
    }
  }

  openLightSourceEditor(index) {
    const sceneData = this.zoneData.scenes[this.sceneId];
    const lightSource = sceneData.lightSources[index];
    createLightSourcePopup(lightSource, (updatedLightSource) => {
      sceneData.lightSources[index] = updatedLightSource;
      this.renderScene(sceneData); // Use this.renderScene to ensure context
    });
  }

  handleSceneClick(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.min(Math.max(0, event.clientX - rect.left), 1000);
    const y = Math.min(Math.max(0, event.clientY - rect.top), 562);
    console.log('isNPCMode:', this.isNPCMode, 'selectedNPCPath:', this.selectedNPCPath);
    if (this.isLightSourceMode) {
      this.addLightSource(x, y);
    } else if (this.isNPCMode && selectedNPCPath) {
      this.addNPCToScene(x, y, selectedNPCPath);
      this.selectedNPCPath = null; // Reset selected NPC path
      this.isNPCMode = false; // Exit NPC mode
      this.setActiveMode(null); // Reset mode buttons
    }
  }

  addLightSource(x, y) {
    const color = '#ffff00'; // Default color (yellow)
    const radius = 50; // Default min radius
    const intensity = 25; // Default max radius
    const pulsate = false; // Default pulse speed
    const minIntensity = 0.2; // Default min intensity
    const maxIntensity = 0.5; // Default max intensity

    const newLightSource = new LightSource(x, y, color, radius, intensity, pulsate, minIntensity, maxIntensity);

    // Ensure the scene has a lightSources array
    const sceneData = this.zoneData.scenes[this.sceneId];
    if (!sceneData.lightSources) {
      sceneData.lightSources = [];
    }
    sceneData.lightSources.push(newLightSource);

    // Re-render the scene to include the new light source
    this.renderScene(sceneData);
  }

  addNPCToScene(x, y, npcPath) {
    const newNPC = new NPC(x, y, npcPath);

    // Ensure the scene has an npcs array
    const sceneData = this.zoneData.scenes[this.sceneId];
    if (!sceneData.npcs) {
      sceneData.npcs = [];
    }
    sceneData.npcs.push(newNPC);

    // Re-render the scene to include the new NPC
    this.renderScene(sceneData);
  }

  deleteLightSource(index) {
    const sceneData = this.zoneData.scenes[this.sceneId];
    sceneData.lightSources.splice(index, 1);
    this.renderScene(sceneData);
  }

  deleteNPC(index) {
    const sceneData = this.zoneData.scenes[this.sceneId];
    sceneData.npcs.splice(index, 1);
    this.renderScene(sceneData);
  }  

  addNPC() {
    console.log('logging value of this outside of chooseNPC ', this);
    const self = this; // Capture the correct context
    chooseNPC(this.sceneId, (npcPath) => {
      console.log('logging value of this inside chooseNPC: ', this);
      selectedNPCPath = npcPath;
      self.toggleNPCMode();
      console.log('Selected NPC:', npcPath);
    }, this.zoneData, this.editorDiv);
  }

  addEntrance() {
    console.log('Add entrance functionality here.');
  }

  showEncounterEditor() {
    console.log('Show encounter editor functionality here.');
  }

  deselectModes() {
    this.setActiveMode(null);
    console.log('Deselected all modes.');
  }
}
