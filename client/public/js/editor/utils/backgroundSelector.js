// utils/backgroundSelector.js

export function chooseBackground(sceneId, zoneType, updateSceneBoxBackground, zone, contentDiv) {
    // Create a popup for selecting the background image
    const popup = document.createElement('div');
    popup.id = 'background-popup';
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
    title.textContent = 'Select Background Image';
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
  
    // Fetch the list of PNG files from the server
    fetch(`http://localhost:8001/api/zone-images/${zoneType}`)
      .then(response => response.json())
      .then(files => {
        files.forEach(file => {
          const img = document.createElement('img');
          img.src = `assets/images/zone/area/normal/${zoneType}/${file}`;
          img.style.width = '400px'; // Larger thumbnails
          img.style.height = '225px'; // Maintain 16:9 aspect ratio
          img.style.cursor = 'pointer';
  
          img.addEventListener('click', () => {
            const relativePath = `assets/images/zone/area/normal/${zoneType}/${file}`;
            zone.scenes[sceneId].background = relativePath;
            const sceneBox = contentDiv.querySelector(`.scene-box[data-id='${sceneId}']`);
            updateSceneBoxBackground(sceneBox, relativePath);
            document.body.removeChild(popup);
          });
  
          imageContainer.appendChild(img);
        });
      })
      .catch(error => {
        console.error('Error fetching zone images:', error);
      });
  }
  
  export function updateSceneBoxBackground(sceneBox, background) {
    if (background) {
      sceneBox.style.backgroundImage = `url(${background})`;
      sceneBox.style.backgroundSize = 'cover';
      sceneBox.style.backgroundPosition = 'center';
    } else {
      sceneBox.style.backgroundImage = '';
      sceneBox.style.backgroundColor = '#007bff';
    }
  }
  