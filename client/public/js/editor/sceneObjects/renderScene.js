// ./sceneObjects/renderScene.js

export function renderScene(sceneData, openLightSourceEditor) {
    const sceneRenderContainer = document.getElementById('scene-render-container');
    sceneRenderContainer.innerHTML = ''; // Clear previous content
  
    if (sceneData.background) {
      const img = document.createElement('img');
      img.src = sceneData.background;
      img.style.position = 'absolute';
      img.style.width = '1000px';
      img.style.height = '562px';
      img.style.objectFit = 'cover'; // Maintain aspect ratio
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
        lightCircle.style.width = `${lightSource.maxRadius * 2}px`;
        lightCircle.style.height = `${lightSource.maxRadius * 2}px`;
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
          openLightSourceEditor(index);
        });
        sceneRenderContainer.appendChild(lightbulb);
      });
    }
  }
  