// utils/sceneEditorToggles.js

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
  
    // Define divider style
    const dividerStyle = {
        width: '1px',
        height: '100%',
        backgroundColor: 'gray',
        margin: '0 10px'
    };
    
    // Function to create buttons with tooltips
    function createButton(id, text, tooltip, eventListener) {
        const button = document.createElement('button');
        button.id = id;
        button.textContent = text;
        Object.assign(button.style, buttonStyle);
        button.title = tooltip;
        button.addEventListener('click', eventListener);
        return button;
    }

    // Create back button
    const backButton = createButton('back-to-zone-editor-button', 'Back', 'Back to Zone Editor', () => {
        this.toggleBackToZoneEditor();
    });
    sceneTools.appendChild(backButton);

    // Add a vertical divider here
    const divider1 = document.createElement('div');
    Object.assign(divider1.style, dividerStyle);
    sceneTools.appendChild(divider1);

    // Create cursor button to deselect modes
    const cursorButton = createButton('select-button', '☝️', 'Selection Tool', () => {
        this.toggleSelectMode();
    });
    sceneTools.appendChild(cursorButton);

    // Create a trashcan button to delete selected objects
    const trashButton = createButton('trash-button', '🗑️', 'Delete Mode', () => {
        this.toggleDeleteMode();
    });
    sceneTools.appendChild(trashButton);

    // Add a vertical divider here
    const divider2 = document.createElement('div');
    Object.assign(divider2.style, dividerStyle);
    sceneTools.appendChild(divider2);

    // Create light source button
    const lightButton = createButton('light-source-button', '💡', 'Add Light Source', () => {
        this.toggleLightSourceMode();
    });
    sceneTools.appendChild(lightButton);

    // Create NPC button
    const npcButton = createButton('npc-button', '👤', 'Add NPC', () => {
        this.toggleNPCMode();
    });
    sceneTools.appendChild(npcButton);

    // Create entrance button
    const entranceButton = createButton('entrance-button', '🚪', 'Add Clickable Transition', () => {
        this.addEntrance();
    });
    sceneTools.appendChild(entranceButton);

    // Add a vertical divider here
    const divider3 = document.createElement('div');
    Object.assign(divider3.style, dividerStyle);
    sceneTools.appendChild(divider3);

    // Create encounter button
    const encounterButton = createButton('encounter-button', '👹', 'Encounter Editor', () => {
        this.showEncounterEditor();
    });
    sceneTools.appendChild(encounterButton);

    // Create encounter button
    const dialogueButton = createButton('dialogue-button', '💬', 'Dialogue Editor', () => {
        this.showDialogueEditor();
    });
    sceneTools.appendChild(dialogueButton);

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
    this.renderScene(sceneData);
  
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
  
    // Reset mode selection
    this.deselectModes();

    // Show the main editor container and zoom controls
    this.editorDiv.style.display = 'block';
    this.zoomControls.style.display = 'flex';
    if (selectedSceneId) {
      this.updateZoneSummary(selectedSceneId);
    }
  }
  