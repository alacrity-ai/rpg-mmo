// utils/sceneEditorToggles.js

import { renderScene } from '../sceneObjects/renderScene.js';

export function toggleSceneEditor(sceneId, zoneData) {
    this.zoneData = zoneData;
    this.sceneId = sceneId;
    const sceneData = this.zoneData.scenes[sceneId];
  
    // Ensure the scene has a lightSources array
    if (!sceneData.lightSources) {
      sceneData.lightSources = [];
    }
  
    // Hide the main editor container and zoom controls
    this.editorDiv.style.display = 'none';
    this.zoomControls.style.display = 'none';
  
    // Show the scene editor container
    this.sceneEditorDiv.style.display = 'block';
  
    // Clear the previous content and add new content
    this.sceneEditorDiv.innerHTML = '';
  
    // Create the scene tools container
    const sceneTools = document.createElement('div');
    sceneTools.id = 'scene-tools';
    sceneTools.style.display = 'flex';
    sceneTools.style.justifyContent = 'left';
    sceneTools.style.alignItems = 'center';
    sceneTools.style.padding = '5px';
    sceneTools.style.backgroundColor = '#e0e0e0';
    sceneTools.style.width = '100%';
    sceneTools.style.height = '32px'; // Adjust the height for a more compact look
  
    // Button styles
    const buttonStyle = {
      padding: '5px 10px',
      fontSize: '12px',
      margin: '0 10px 0 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    };
  
    // Create back button
    const backButton = document.createElement('button');
    backButton.id = 'back-to-zone-editor-button';
    backButton.textContent = 'Back';
    Object.assign(backButton.style, buttonStyle);
    backButton.addEventListener('click', () => {
      this.toggleBackToZoneEditor();
    });
    sceneTools.appendChild(backButton);

    // Create cursor button to deselect modes
    const cursorButton = document.createElement('button');
    cursorButton.id = 'cursor-button';
    cursorButton.textContent = '☝️';
    Object.assign(cursorButton.style, buttonStyle);
    cursorButton.addEventListener('click', () => {
      this.deselectModes();
    });
    sceneTools.appendChild(cursorButton);

    // Create light source button
    const lightButton = document.createElement('button');
    lightButton.id = 'light-source-button';
    lightButton.textContent = '💡';
    Object.assign(lightButton.style, buttonStyle);
    lightButton.addEventListener('click', () => {
      this.toggleLightSourceMode(lightButton);
    });
    sceneTools.appendChild(lightButton);
  
    // Create NPC button
    const npcButton = document.createElement('button');
    npcButton.id = 'npc-button';
    npcButton.textContent = '👤';
    Object.assign(npcButton.style, buttonStyle);
    npcButton.addEventListener('click', () => {
      this.addNPC();
    });
    sceneTools.appendChild(npcButton);
  
    // Create entrance button
    const entranceButton = document.createElement('button');
    entranceButton.id = 'entrance-button';
    entranceButton.textContent = '🚪';
    Object.assign(entranceButton.style, buttonStyle);
    entranceButton.addEventListener('click', () => {
      this.addEntrance();
    });
    sceneTools.appendChild(entranceButton);
  
    // Append scene tools to the scene editor container
    this.sceneEditorDiv.appendChild(sceneTools);
  
    // Create scene render container
    const sceneRenderContainer = document.createElement('div');
    sceneRenderContainer.id = 'scene-render-container';
    sceneRenderContainer.style.position = 'relative';
    sceneRenderContainer.style.width = '1000px';
    sceneRenderContainer.style.height = '562px';
    sceneRenderContainer.style.background = '#000';
    sceneRenderContainer.style.margin = 'auto';
    this.sceneEditorDiv.appendChild(sceneRenderContainer);
  
    // Create coordinate display
    const coordinateDisplay = document.createElement('div');
    coordinateDisplay.id = 'coordinate-display';
    coordinateDisplay.style.marginTop = '10px';
    coordinateDisplay.style.fontFamily = 'Arial, sans-serif';
    coordinateDisplay.textContent = 'Coordinates: (0, 0)';
    this.sceneEditorDiv.appendChild(coordinateDisplay);
  
    // Render the scene
    renderScene(sceneData, this.openLightSourceEditor.bind(this));
  
    // Add event listener to the scene render container
    sceneRenderContainer.addEventListener('click', (event) => {
      this.handleSceneClick(event);
    });
  
    // Add event listener to track mouse movement
    sceneRenderContainer.addEventListener('mousemove', (event) => {
      const rect = sceneRenderContainer.getBoundingClientRect();
      const x = Math.min(Math.max(0, event.clientX - rect.left), 1000);
      const y = Math.min(Math.max(0, event.clientY - rect.top), 562);
      document.getElementById('coordinate-display').textContent = `Coordinates: (${x}, ${y})`;
    });
  }
  
  export function toggleBackToZoneEditor() {
    // Hide the scene editor container
    this.sceneEditorDiv.style.display = 'none';
  
    // Show the main editor container and zoom controls
    this.editorDiv.style.display = 'block';
    this.zoomControls.style.display = 'flex';
  }
  