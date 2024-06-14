// utils/npcSelector.js

// utils/npcSelector.js

export function chooseNPC(sceneId, onSelectNPC, zone, contentDiv) {
    // Create a popup for selecting the NPC image
    const popup = document.createElement('div');
    popup.id = 'npc-popup';
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.padding = '20px';
    popup.style.backgroundColor = '#fff';
    popup.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
    popup.style.zIndex = '1000'; // Ensure the popup is on top
    popup.style.maxHeight = '80vh'; // Ensure the popup does not exceed 80% of viewport height
    popup.style.maxWidth = '90vw'; // Ensure the popup does not exceed 90% of viewport width
    popup.style.overflowY = 'auto'; // Enable vertical scrolling if content exceeds max height
  
    const title = document.createElement('h3');
    title.textContent = 'Select NPC Image';
    popup.appendChild(title);
  
    const imageContainer = document.createElement('div');
    imageContainer.style.display = 'grid';
    imageContainer.style.gridTemplateColumns = '1fr 1fr'; // Two columns
    imageContainer.style.gridGap = '20px'; // Gap between thumbnails
    imageContainer.style.maxHeight = '60vh'; // Set the max height for the container
    imageContainer.style.overflowY = 'auto'; // Enable vertical scrolling if needed
    popup.appendChild(imageContainer);
  
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.display = 'block';
    closeButton.style.margin = '10px auto';
    closeButton.addEventListener('click', () => {
      document.body.removeChild(popup);
    });
    popup.appendChild(closeButton);
  
    document.body.appendChild(popup);
  
    // Fetch the map of NPC editor.png files from the server
    fetch('http://localhost:8001/api/npc-images')
      .then(response => response.json())
      .then(npcMap => {
        Object.keys(npcMap).forEach(npcPath => {
          const img = document.createElement('img');
          img.src = `assets/images/npcs/${npcPath}`;
          img.style.width = '200px'; // Thumbnail width
          img.style.height = '200px'; // Thumbnail height
          img.style.cursor = 'pointer';
  
          img.addEventListener('click', () => {
            onSelectNPC(img.src);
            document.body.removeChild(popup);
          });
  
          imageContainer.appendChild(img);
        });
      })
      .catch(error => {
        console.error('Error fetching NPC images:', error);
      });
  }
  
  
  export function updateSceneBoxNPC(sceneBox, npcImagePath) {
    if (npcImagePath) {
      // Append the NPC image to the scene box
      const npcImage = document.createElement('img');
      npcImage.src = npcImagePath;
      npcImage.style.width = '100px'; // Thumbnail width in the scene box
      npcImage.style.height = '100px'; // Thumbnail height in the scene box
      npcImage.style.position = 'absolute';
      npcImage.style.bottom = '0';
      npcImage.style.right = '0';
      sceneBox.appendChild(npcImage);
    } else {
      // Optionally handle the case where no NPC image is provided
      console.warn('No NPC image path provided.');
    }
  }
  