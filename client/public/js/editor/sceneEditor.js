import { toggleBackToZoneEditor } from './utils/sceneEditorToggles.js';
import { LightSource } from './sceneObjects/lightSource.js';
import { createLightSourcePopup } from './popups/lightSourceEditor.js';
import { chooseNPC, updateSceneBoxNPC } from './utils/npcSelector.js';
import { createNPCPopup } from './popups/npcEditor.js';
import { createEntrancePopup } from './popups/entranceEditor.js';
import { NPC } from './sceneObjects/NpcObject.js';
import { EntranceObject } from './sceneObjects/entranceObject.js';
import { DialogueEditor } from './dialogueEditor.js';
import { createEncounterPopup } from './popups/encounterEditor.js';
import { drawBox } from './utils/drawBox.js';
import { createAudioPopup } from './popups/audioEditor.js';
import { createWeatherPopup } from './popups/weatherEditor.js';


// let selectedNPCPath = null;

export class SceneEditor {
  constructor(zoneData, zoneEditor) {
    this.zoneData = zoneData; // The same as the 'zone' object in the main editor
    this.sceneId = null;

    this.zoneEditor = zoneEditor; // Reference to the main editor

    this.editorDiv = document.getElementById('editor-container');
    this.sceneEditorDiv = document.createElement('div');
    this.sceneEditorDiv.id = 'scene-editor-container';
    this.sceneEditorDiv.style.display = 'none'; // Initially hidden
    document.getElementById('editor-root').appendChild(this.sceneEditorDiv);
    this.zoomControls = document.getElementById('zoom-controls');
    this.isLightSourceMode = false; // Track whether light source mode is active
    this.isDeleteMode = false; // Track whether delete mode is active
    this.isNPCMode = false; // Track whether NPC mode is active
    this.isEntranceMode = false; // Track whether entrance mode is active
    this.isSelectMode = false; // Track whether select mode is active
    this.entranceStartPoint = null; // Track entrance start point
    this.selectedNPCPath = null; // Store the selected NPC path

    this.dialogueEditor = new DialogueEditor(this.zoneEditor);
    this.toggleBackToZoneEditor = toggleBackToZoneEditor.bind(this);
    this.handleSceneClick = this.handleSceneClick.bind(this); // Ensure handleSceneClick is properly bound
    this.updateCursorStyle = this.updateCursorStyle.bind(this);
    this.showInstruction = this.showInstruction.bind(this);
    this.hideInstruction = this.hideInstruction.bind(this); // Ensure hideInstruction is properly bound
  }

  setActiveMode(mode) {
    // Deactivate all modes
    this.isLightSourceMode = false;
    this.isDeleteMode = false;
    this.isNPCMode = false;
    this.isEntranceMode = false;
    this.isSelectMode = false;
    this.selectedNPCPath = null;

    // Reset all mode buttons' styles
    const lightButton = document.getElementById('light-source-button');
    const deleteButton = document.getElementById('trash-button');
    const npcButton = document.getElementById('npc-button');
    const entranceButton = document.getElementById('entrance-button');
    const selectButton = document.getElementById('select-button');
    if (lightButton) lightButton.style.backgroundColor = '#007bff';
    if (deleteButton) deleteButton.style.backgroundColor = '#007bff';
    if (npcButton) npcButton.style.backgroundColor = '#007bff';
    if (entranceButton) entranceButton.style.backgroundColor = '#007bff';
    if (selectButton) selectButton.style.backgroundColor = '#007bff';

    // Activate the selected mode and update button style
    switch (mode) {
      case 'lightSource':
        this.isLightSourceMode = true;
        if (lightButton) lightButton.style.backgroundColor = '#ff0';
        this.showInstruction('Click to place a light source.');
        break;
      case 'delete':
        this.isDeleteMode = true;
        if (deleteButton) deleteButton.style.backgroundColor = '#ff0';
        this.showInstruction('Click to delete an object.');
        break;
      case 'npc':
        this.isNPCMode = true;
        if (npcButton) npcButton.style.backgroundColor = '#ff0';
        this.showInstruction('Click to place an NPC.');
        break;
      case 'entrance':
        this.isEntranceMode = true;
        if (entranceButton) entranceButton.style.backgroundColor = '#ff0';
        this.showInstruction('Click to set the first point of the entrance.');
        break;
      case 'select':
        this.isSelectMode = true;
        if (selectButton) selectButton.style.backgroundColor = '#ff0';
        this.showInstruction('Click to edit an object.');
        break;
      default:
        this.hideInstruction();
        break;
    }

    this.updateCursorStyle();
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

  toggleEntranceMode() {
    this.setActiveMode(this.isEntranceMode ? null : 'entrance');
    this.entranceStartPoint = null; // Reset entrance start point
  }

  toggleSelectMode() {
    this.setActiveMode(this.isSelectMode ? null : 'select');
  }

  updateCursorStyle() {
    const sceneRenderContainer = document.getElementById('scene-render-container');
    if (this.isEntranceMode) {
      sceneRenderContainer.style.cursor = this.entranceStartPoint ? 'cell' : 'crosshair';
    } else if (this.isLightSourceMode) {
      sceneRenderContainer.style.cursor = 'crosshair';
    } else if (this.isNPCMode) {
      sceneRenderContainer.style.cursor = 'crosshair';
    } else if (this.isDeleteMode) {
      sceneRenderContainer.style.cursor = 'not-allowed';
    } else if (this.isSelectMode) {
      sceneRenderContainer.style.cursor = 'pointer';
    } else {
      sceneRenderContainer.style.cursor = 'default';
    }
  }

  showInstruction(message) {
    let instructionDiv = document.getElementById('instruction-div');
    if (!instructionDiv) {
      instructionDiv = document.createElement('div');
      instructionDiv.id = 'instruction-div';
      instructionDiv.style.position = 'absolute';
      instructionDiv.style.top = '10px';
      instructionDiv.style.left = '50%';
      instructionDiv.style.transform = 'translateX(-50%)';
      instructionDiv.style.padding = '10px 20px';
      instructionDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      instructionDiv.style.color = '#fff';
      instructionDiv.style.borderRadius = '5px';
      instructionDiv.style.zIndex = '1000';
      document.body.appendChild(instructionDiv);
    }
    instructionDiv.textContent = message;
    instructionDiv.style.display = 'block';
  }

  hideInstruction() {
    const instructionDiv = document.getElementById('instruction-div');
    if (instructionDiv) {
      instructionDiv.style.display = 'none';
    }
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
        lightbulb.style.zIndex = '10';

        lightbulb.addEventListener('click', (event) => {
          event.stopPropagation(); // Prevent triggering other click events
          if (this.isDeleteMode) {
            this.deleteLightSource(index);
          } else if (this.isLightSourceMode || this.isSelectMode) {
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
        npcImage.style.left = `${npc.x - (170 * npc.scale / 2)}px`; // Center horizontally
        npcImage.style.top = `${npc.y - (170 * npc.scale / 2)}px`; // Center vertically
        npcImage.style.width = `${170 * npc.scale}px`;
        npcImage.style.height = `${170 * npc.scale}px`;
        npcImage.style.cursor = 'pointer';
        npcImage.style.zIndex = '5';

        if (npc.flipped) {
          npcImage.style.transform = 'scaleX(-1)';
        }

        npcImage.addEventListener('click', (event) => {
          event.stopPropagation(); // Prevent triggering other click events
          if (this.isDeleteMode) {
            this.deleteNPC(index);
          } else if (this.isNPCMode || this.isSelectMode) {
            this.openNpcEditor(index);
          }
        });

        sceneRenderContainer.appendChild(npcImage);
      });
    }

    // Render entrances
    if (sceneData.entrances) {
      sceneData.entrances.forEach((entrance, index) => { // Add index here
        const box = drawBox(entrance.x1, entrance.y1, entrance.x2, entrance.y2, sceneRenderContainer);
        box.addEventListener('click', (event) => {
          event.stopPropagation(); // Prevent triggering other click events
          if (this.isDeleteMode) {
            this.deleteEntrance(index);
          } else if (this.isEntranceMode || this.isSelectMode) {
            this.openEntranceEditor(index);
          }
        });
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

  openNpcEditor(index) {
    const sceneData = this.zoneData.scenes[this.sceneId];
    const npc = sceneData.npcs[index];
    createNPCPopup(npc, (updatedNPC) => {
      sceneData.npcs[index] = updatedNPC;
      this.renderScene(sceneData); // Use this.renderScene to ensure context
    });
  }

  openEntranceEditor(index) {
    const sceneData = this.zoneData.scenes[this.sceneId];
    const entrance = sceneData.entrances[index];
    createEntrancePopup(entrance, (updatedEntrance) => {
      sceneData.entrances[index] = updatedEntrance;
      this.renderScene(sceneData); // Use this.renderScene to ensure context
    }, this.zoneData); // Pass zoneData to the popup
  }

  handleSceneClick(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.min(Math.max(0, event.clientX - rect.left), 1000);
    const y = Math.min(Math.max(0, event.clientY - rect.top), 562);
    console.log('isNPCMode:', this.isNPCMode, 'selectedNPCPath:', this.selectedNPCPath);
    if (this.isLightSourceMode) {
      this.addLightSource(x, y);
      this.hideInstruction(); // Hide instruction after placing the light source
    } else if (this.isNPCMode) {
      this.addNPCToScene(x, y);
      this.hideInstruction(); // Hide instruction after placing the NPC
    } else if (this.isEntranceMode) {
      this.addEntrancePoint(x, y);
    }
  }

  addLightSource(x, y) {
    const color = '#ffff00'; // Default color (yellow)
    const radius = 50; // Default min radius
    const intensity = 0.5; // Default max radius
    const pulsate = false; // Default pulse speed
    const minIntensity = 0.3; // Default min intensity
    const maxIntensity = 0.7; // Default max intensity

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

  addNPCToScene(x, y) {
    chooseNPC(this.sceneId, (npcPath) => {
      const atlasPath = this.extractAtlasPath(npcPath);
      const newNPC = new NPC(x, y, npcPath, 1, false, '', atlasPath);
      const sceneData = this.zoneData.scenes[this.sceneId];
      if (!sceneData.npcs) {
        sceneData.npcs = [];
      }
      sceneData.npcs.push(newNPC);
      this.renderScene(sceneData);
    }, this.zoneData, this.editorDiv);
  }
  
  extractAtlasPath(npcPath) {
    const url = new URL(npcPath);
    const parts = url.pathname.split('/');
    parts.pop(); // Remove the last part ('editor.png')
    // Remove leading slash if it exists
    if (parts[0] === '') {
      parts.shift();
    }
    return parts.join('/');
  }   

  addEntrancePoint(x, y) {
    if (!this.entranceStartPoint) {
      this.entranceStartPoint = { x, y };
      this.showInstruction('Click to set the second point of the entrance.');
      this.updateCursorStyle();
    } else {
      const x1 = this.entranceStartPoint.x;
      const y1 = this.entranceStartPoint.y;
      const x2 = x;
      const y2 = y;

      const newEntrance = new EntranceObject(x1, y1, x2, y2, 'defaultSceneKey', false);

      // Ensure the scene has an entrances array
      const sceneData = this.zoneData.scenes[this.sceneId];
      if (!sceneData.entrances) {
        sceneData.entrances = [];
      }
      sceneData.entrances.push(newEntrance);

      // Re-render the scene to include the new entrance
      this.renderScene(sceneData);

      // Reset entrance start point and disable entrance mode
      this.entranceStartPoint = null;
      this.hideInstruction();
      this.setActiveMode(null); // Disable entrance mode
      this.updateCursorStyle();
    }
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

  deleteEntrance(index) { // Add this function
    const sceneData = this.zoneData.scenes[this.sceneId];
    sceneData.entrances.splice(index, 1);
    this.renderScene(sceneData);
  }

  addNPC() {
    this.toggleNPCMode();
  }

  addEntrance() {
    this.toggleEntranceMode();
    console.log('Entrance mode activated.');
  }

  showEncounterEditor() {
    const sceneData = this.zoneData.scenes[this.sceneId];
    createEncounterPopup(sceneData, (updatedSceneData) => {
      this.zoneData.scenes[this.sceneId] = updatedSceneData;
      this.renderScene(updatedSceneData);
    });
  }  

  showAudioEditor() {
    const sceneData = this.zoneData.scenes[this.sceneId];
    if (!sceneData.audio) {
      sceneData.audio = new Audio();
    }
    createAudioPopup(sceneData.audio, this.zoneData.scenes, (updatedAudioData) => {
      sceneData.audio = updatedAudioData;
      this.renderScene(sceneData);
    });
  }  

  showWeatherEditor() {
    const sceneData = this.zoneData.scenes[this.sceneId];
    createWeatherPopup(sceneData, this.zoneData.scenes, (updatedSceneData) => {
      this.zoneData.scenes[this.sceneId] = updatedSceneData;
      this.renderScene(updatedSceneData);
    });
  }  

  showDialogueEditor() {
    this.sceneEditorDiv.style.display = 'none';
    this.dialogueEditor.show(this.sceneId, this.zoneData);
  }

  deselectModes() {
    this.setActiveMode(null);
    console.log('Deselected all modes.');
  }
}
