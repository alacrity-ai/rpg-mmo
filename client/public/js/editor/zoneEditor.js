import { renderSceneTools, hideSceneTools  } from './sceneTools.js';
import { chooseBackground, updateSceneBoxBackground } from './utils/backgroundSelector.js';
import { SceneEditor } from './sceneEditor.js';
import { toggleSceneEditor } from './utils/sceneEditorToggles.js';
const EDITOR_SERVER_URL = import.meta.env.VITE_EDITOR_SERVER_URL;

export class ZoneEditor {
    constructor(editorDiv) {
      this.editorDiv = editorDiv;
      this.contentDiv = this.editorDiv.querySelector('.content'); // Reference to the .content element
      this.zone = null;
      this.scenePositions = {}; // Keep track of scene positions on the grid
      this.availableSceneIds = []; // Keep track of available scene IDs
      this.zoneType = ''; // Store the selected zone type
      this.offsetX = 1000; // Offset for the initial X position
      this.offsetY = 1000; // Offset for the initial Y position
      this.zoomLevel = 1; // Initial zoom level

      // Initialize the SceneEditor with the zone data
      this.sceneEditor = new SceneEditor(this.zone, this);
      this.toggleSceneEditor = toggleSceneEditor.bind(this.sceneEditor);

      // Bind zoom controls
      document.getElementById('zoom-in').addEventListener('click', () => this.zoomIn());
      document.getElementById('zoom-out').addEventListener('click', () => this.zoomOut());
      document.getElementById('zoom-reset').addEventListener('click', () => this.zoomReset());

    }

    zoomReset() {
        this.zoomLevel = 1; // Reset zoom level to initial value
        this.applyZoom();
      }      
      
      zoomIn() {
        this.zoomLevel = Math.min(this.zoomLevel + 0.4, 10); // Max zoom level
        this.applyZoom();
      }
        
      zoomOut() {
        this.zoomLevel = Math.max(this.zoomLevel - 0.2, 0.2); // Min zoom level
        this.applyZoom();
      }
      
      applyZoom() {
        if (this.contentDiv) {
          const { scrollLeft, scrollTop, clientWidth, clientHeight } = this.editorDiv;
      
          // Calculate the current center position
          const centerX = scrollLeft + clientWidth / 2;
          const centerY = scrollTop + clientHeight / 2;
      
          // Calculate the scale ratio
          const scaleRatio = this.zoomLevel / parseFloat(this.contentDiv.style.transform.replace('scale(', '').replace(')', '') || 1);
      
          // Apply the new scale transformation
          this.contentDiv.style.transform = `scale(${this.zoomLevel})`;
          this.contentDiv.style.transformOrigin = 'top left'; // Keep the transform origin at the top left corner
      
          // Calculate new scroll positions to maintain center position
          const newScrollLeft = (centerX * scaleRatio) - (clientWidth / 2);
          const newScrollTop = (centerY * scaleRatio) - (clientHeight / 2);
      
          // Set new scroll positions
          this.editorDiv.scrollLeft = newScrollLeft;
          this.editorDiv.scrollTop = newScrollTop;
        } else {
          console.error('Content element not found');
        }
      }
      

    initializeNewZone() {
        // Create a popup for selecting the zone type
        const popup = document.createElement('div');
        popup.id = 'zone-type-popup';
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.padding = '20px';
        popup.style.backgroundColor = '#fff';
        popup.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
        popup.style.zIndex = '1000'; // Ensure the popup is on top

        const title = document.createElement('h3');
        title.textContent = 'Select Zone Type';
        popup.appendChild(title);

        const select = document.createElement('select');
        select.style.width = '100%';
        select.style.margin = '10px 0';
        popup.appendChild(select);

        const confirmButton = document.createElement('button');
        confirmButton.textContent = 'Select';
        confirmButton.style.display = 'block';
        confirmButton.style.margin = '10px auto';
        confirmButton.addEventListener('click', () => {
            this.zoneType = select.value;
            document.body.removeChild(popup);
            this.initializeZone();
        });
        popup.appendChild(confirmButton);

        document.body.appendChild(popup);

        // Fetch the zone types from the server
        console.log(`${EDITOR_SERVER_URL}/api/zone-types`)
        fetch(`${EDITOR_SERVER_URL}/api/zone-types`)
            .then(response => response.json())
            .then(zoneTypes => {
            zoneTypes.forEach(zoneType => {
                const option = document.createElement('option');
                option.value = zoneType;
                option.textContent = zoneType;
                select.appendChild(option);
            });
            })
            .catch(error => {
            console.error('Error fetching zone types:', error);
            });
    }


  initializeZone() {
    this.zone = {
      scenes: {
        scene1: {
          name: 'Scene 1',
          connections: {
            north: null,
            south: null,
            east: null,
            west: null
          },
          background: null
        }
      }
    };
  
    // Initialize scene positions
    this.scenePositions = {
      scene1: { x: 0, y: 0 }
    };
  
    this.availableSceneIds = []; // Reset available IDs
  
    // Clear the editor container and display initial scene
    this.contentDiv.innerHTML = '';
    this.displayScene('scene1', this.zone.scenes.scene1);
  
    // Add a dummy element far to the south and right for scrolling buffer
    const dummyElement = document.createElement('div');
    dummyElement.style.position = 'absolute';
    dummyElement.style.top = `calc(50% + ${this.offsetY + 2000}px)`; // Buffer to the south
    dummyElement.style.left = `calc(50% + ${this.offsetX + 2000}px)`; // Buffer to the right
    dummyElement.style.width = '10px';
    dummyElement.style.height = '10px';
    dummyElement.style.backgroundColor = 'transparent'; // Invisible dummy element
    this.contentDiv.appendChild(dummyElement);
  
    // Center the view on the initial scene
    this.centerViewOnInitialScene();
  }
  
  centerViewOnInitialScene() {
    const containerRect = this.editorDiv.getBoundingClientRect();
    const initialSceneX = this.offsetX + containerRect.width / 2;
    const initialSceneY = this.offsetY + containerRect.height / 2;
  
    this.editorDiv.scrollLeft = initialSceneX - containerRect.width / 2;
    this.editorDiv.scrollTop = initialSceneY - containerRect.height / 2;
  }
  
  loadZoneFromFile(zoneData) {
    this.zone = zoneData;
    this.scenePositions = {}; // Reset scene positions

    // Clear the content container
    this.contentDiv.innerHTML = '';

    // Populate scenes and their positions
    for (const sceneId in this.zone.scenes) {
      const scene = this.zone.scenes[sceneId];
      // Calculate scene position based on its connections
      const position = this.calculateScenePosition(sceneId, scene.connections);
      this.scenePositions[sceneId] = position;
      this.displayScene(sceneId, scene);
    }

    // Add a dummy element far to the south and right for scrolling buffer
    const dummyElement = document.createElement('div');
    dummyElement.style.position = 'absolute';
    dummyElement.style.top = `calc(50% + ${this.offsetY + 2000}px)`; // Buffer to the south
    dummyElement.style.left = `calc(50% + ${this.offsetX + 2000}px)`; // Buffer to the right
    dummyElement.style.width = '10px';
    dummyElement.style.height = '10px';
    dummyElement.style.backgroundColor = 'transparent'; // Invisible dummy element
    this.contentDiv.appendChild(dummyElement);

    // Center the view on the initial scene (if exists)
    if (this.zone.scenes.scene1) {
      this.centerViewOnScene('scene1');
    }
  }

  calculateScenePosition(sceneId, connections) {
    // Calculate the position of a scene based on its connections
    const initialPosition = { x: 0, y: 0 };

    // Iterate over connections to determine the position
    for (const direction in connections) {
      const connectedSceneId = connections[direction];
      if (connectedSceneId && this.scenePositions[connectedSceneId]) {
        const connectedPosition = this.scenePositions[connectedSceneId];
        switch (direction) {
          case 'north':
            initialPosition.x = connectedPosition.x;
            initialPosition.y = connectedPosition.y + 1;
            break;
          case 'south':
            initialPosition.x = connectedPosition.x;
            initialPosition.y = connectedPosition.y - 1;
            break;
          case 'east':
            initialPosition.x = connectedPosition.x - 1;
            initialPosition.y = connectedPosition.y;
            break;
          case 'west':
            initialPosition.x = connectedPosition.x + 1;
            initialPosition.y = connectedPosition.y;
            break;
          default:
            break;
        }
      }
    }

    return initialPosition;
  }

  centerViewOnScene(sceneId) {
    const sceneBox = this.contentDiv.querySelector(`.scene-box[data-id='${sceneId}']`);
    if (sceneBox) {
      const containerRect = this.editorDiv.getBoundingClientRect();
      const sceneBoxRect = sceneBox.getBoundingClientRect();
      this.editorDiv.scrollLeft = sceneBoxRect.left - containerRect.left + this.editorDiv.scrollLeft - containerRect.width / 2 + sceneBoxRect.width / 2;
      this.editorDiv.scrollTop = sceneBoxRect.top - containerRect.top + this.editorDiv.scrollTop - containerRect.height / 2 + sceneBoxRect.height / 2;
    }
  }

  saveZoneToFile() {
    const blob = new Blob([JSON.stringify(this.zone, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'zone.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  displayScene(sceneId, sceneData) {
    // Create and append scene box
    const sceneBox = document.createElement('div');
    sceneBox.className = 'scene-box';
    sceneBox.dataset.id = sceneId;
    updateSceneBoxBackground(sceneBox, sceneData.background);
    sceneBox.textContent = sceneData.name;
    this.contentDiv.appendChild(sceneBox);

    // Position the initial scene box at the center
    if (sceneId === 'scene1') {
      sceneBox.style.top = `calc(50% + ${this.offsetY}px)`;
      sceneBox.style.left = `calc(50% + ${this.offsetX}px)`;
      sceneBox.style.transform = 'translate(-50%, -50%)';
    } else {
      const { x, y } = this.scenePositions[sceneId];
      sceneBox.style.top = `calc(50% + ${y * 150}px + ${this.offsetY}px)`;
      sceneBox.style.left = `calc(50% + ${x * 150}px + ${this.offsetX}px)`;
      sceneBox.style.transform = 'translate(-50%, -50%)';
    }

    // Add click event to scene box
    sceneBox.addEventListener('click', () => {
      // Hide all arrows and connection buttons from other scenes
      this.hideAllConnectionButtons();
      // Toggle connection buttons around the box for connections
      this.toggleConnectionButtons(sceneBox, sceneId);
      // Render scene tools
      renderSceneTools(sceneId, this.deleteScene.bind(this), this.editScene.bind(this), this.chooseBackground.bind(this));
    });

    // Display connection buttons for existing connections
    this.displayExistingConnections(sceneBox, sceneId);
  }

  hideAllConnectionButtons() {
    const allConnectionButtons = document.querySelectorAll('.connection-button');
    allConnectionButtons.forEach(button => button.remove());
  }

  toggleConnectionButtons(sceneBox, sceneId) {
    this.hideAllConnectionButtons(); // Ensure all other connection buttons are hidden

    // Always display buttons for existing connections
    this.displayExistingConnections(sceneBox, sceneId);

    const existingButtons = sceneBox.querySelectorAll('.connection-button:not(.existing-connection)');
    if (existingButtons.length > 0) {
      // If buttons are already displayed, remove them
      existingButtons.forEach(button => button.remove());
    } else {
      // Otherwise, display buttons for north, south, east, west directions
      const directions = ['north', 'south', 'east', 'west'];
      directions.forEach(dir => {
        // Check for existing connections
        if (this.zone.scenes[sceneId].connections[dir] === null) {
          const button = document.createElement('div');
          button.className = `connection-button connection-button-${dir} add-connection`;
          button.textContent = '+';
          sceneBox.appendChild(button);

          button.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent the scene box click event
            // Handle adding new scene in the specified direction
            this.addScene(sceneId, dir, button);
          });
        }
      });
    }
  }

  displayExistingConnections(sceneBox, sceneId) {
    const directions = ['north', 'south', 'east', 'west'];
    directions.forEach(dir => {
      const connectedSceneId = this.zone.scenes[sceneId].connections[dir];
      if (connectedSceneId !== null) {
        const button = document.createElement('div');
        button.className = `connection-button connection-button-${dir} existing-connection`;
        button.textContent = 'O';
        sceneBox.appendChild(button);

        button.addEventListener('click', (e) => {
          e.stopPropagation(); // Prevent the scene box click event
          // Handle removing the connection
          this.removeConnection(sceneId, connectedSceneId, dir);
        });
      }
    });
  }

  addScene(fromSceneId, direction, button) {
    const { x, y } = this.scenePositions[fromSceneId];
    const newCoords = this.getNewCoords(x, y, direction);

    // Check if a scene already exists at the new coordinates
    const existingSceneId = this.getSceneAtCoords(newCoords.x, newCoords.y);
    if (existingSceneId) {
      // Update connections with the existing scene
      this.zone.scenes[fromSceneId].connections[direction] = existingSceneId;
      this.zone.scenes[existingSceneId].connections[this.getOppositeDirection(direction)] = fromSceneId;
      // Replace the button with a connection button
      button.textContent = 'O';
      button.removeEventListener('click', this.addScene);
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        this.removeConnection(fromSceneId, existingSceneId, direction);
      });
      return;
    }

    // Determine new scene ID
    let newSceneId;
    if (this.availableSceneIds.length > 0) {
      newSceneId = this.availableSceneIds.pop();
    } else {
      newSceneId = `scene${Object.keys(this.zone.scenes).length + 1}`;
    }

    this.zone.scenes[newSceneId] = {
      name: `Scene ${newSceneId.replace('scene', '')}`,
      connections: {
        north: null,
        south: null,
        east: null,
        west: null
      },
      background: null
    };

    // Update connections in the JSON object
    this.zone.scenes[fromSceneId].connections[direction] = newSceneId;
    this.zone.scenes[newSceneId].connections[this.getOppositeDirection(direction)] = fromSceneId;

    // Replace the button with a connection button
    button.textContent = 'O';
    button.removeEventListener('click', this.addScene);
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      this.removeConnection(fromSceneId, newSceneId, direction);
    });

    // Update scene positions
    this.scenePositions[newSceneId] = newCoords;

    // Display the new scene box
    const newSceneBox = document.createElement('div');
    newSceneBox.className = 'scene-box';
    newSceneBox.dataset.id = newSceneId;
    updateSceneBoxBackground(newSceneBox, this.zone.scenes[newSceneId].background);
    newSceneBox.textContent = this.zone.scenes[newSceneId].name;
    this.contentDiv.appendChild(newSceneBox);

    // Position the new scene box based on the direction
    this.positionSceneBox(newSceneBox, newCoords.x, newCoords.y);

    // Add click event to new scene box
    newSceneBox.addEventListener('click', () => {
      this.hideAllConnectionButtons();
      this.toggleConnectionButtons(newSceneBox, newSceneId);
      renderSceneTools(newSceneId, this.deleteScene.bind(this), this.editScene.bind(this), this.chooseBackground.bind(this));
    });
  }

  removeConnection(sceneId1, sceneId2, direction) {
    // Update connections in the JSON object
    this.zone.scenes[sceneId1].connections[direction] = null;
    this.zone.scenes[sceneId2].connections[this.getOppositeDirection(direction)] = null;

    // Remove the connection button from the scene box
    const sceneBox1 = document.querySelector(`.scene-box[data-id='${sceneId1}']`);
    const sceneBox2 = document.querySelector(`.scene-box[data-id='${sceneId2}']`);
    sceneBox1.querySelector(`.connection-button-${direction}`).remove();
    sceneBox2.querySelector(`.connection-button-${this.getOppositeDirection(direction)}`).remove();
  }

  deleteScene(sceneId) {
    // Remove the scene from the zone
    delete this.zone.scenes[sceneId];

    // Remove the scene from the scene positions
    delete this.scenePositions[sceneId];

    // Add the scene ID to the available list
    this.availableSceneIds.push(sceneId);

    // Remove connections to this scene
    for (const id in this.zone.scenes) {
      for (const dir in this.zone.scenes[id].connections) {
        if (this.zone.scenes[id].connections[dir] === sceneId) {
          this.zone.scenes[id].connections[dir] = null;
        }
      }
    }

    // Remove the scene box
    const sceneBox = document.querySelector(`.scene-box[data-id='${sceneId}']`);
    sceneBox.remove();

    // Remove the scene tools toolbar if it's displayed
    const sceneTools = document.getElementById('scene-tools');
    if (sceneTools) {
      sceneTools.remove();
    }
  }

  editScene(sceneId) {
    hideSceneTools();
    this.toggleSceneEditor(sceneId, this.zone);
  }

  chooseBackground(sceneId) {
    chooseBackground(sceneId, this.zoneType, updateSceneBoxBackground, this.zone, this.contentDiv);
  }

  getNewCoords(x, y, direction) {
    switch (direction) {
      case 'north': return { x: x, y: y - 1 };
      case 'south': return { x: x, y: y + 1 };
      case 'east': return { x: x + 1, y: y };
      case 'west': return { x: x - 1, y: y };
      default: return { x: x, y: y };
    }
  }

  getSceneAtCoords(x, y) {
    for (const sceneId in this.scenePositions) {
      if (this.scenePositions[sceneId].x === x && this.scenePositions[sceneId].y === y) {
        return sceneId;
      }
    }
    return null;
  }

  getOppositeDirection(direction) {
    const opposites = {
      north: 'south',
      south: 'north',
      east: 'west',
      west: 'east'
    };
    return opposites[direction];
  }

  positionSceneBox(sceneBox, x, y) {
    sceneBox.style.top = `calc(50% + ${y * 150}px + ${this.offsetY}px)`;
    sceneBox.style.left = `calc(50% + ${x * 150}px + ${this.offsetX}px)`;
    sceneBox.style.transform = 'translate(-50%, -50%)';
  }
}
