export function renderSceneTools(sceneId, deleteSceneCallback, editSceneCallback, chooseBackgroundCallback) {
    // Remove existing scene tools if any
    const existingTools = document.getElementById('scene-tools');
    if (existingTools) {
      existingTools.remove();
    }
  
    // Create scene tools container
    const sceneTools = document.createElement('div');
    sceneTools.id = 'scene-tools';
    sceneTools.style.display = 'flex';
    sceneTools.style.justifyContent = 'space-around';
    sceneTools.style.padding = '10px';
    sceneTools.style.backgroundColor = '#e0e0e0';
    sceneTools.style.width = '100%';
  
    // Create delete scene button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete Scene';
    deleteButton.addEventListener('click', () => deleteSceneCallback(sceneId));
    sceneTools.appendChild(deleteButton);
  
    // Create edit scene button
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit Scene';
    editButton.addEventListener('click', () => editSceneCallback(sceneId));
    sceneTools.appendChild(editButton);
  
    // Create choose background button
    const backgroundButton = document.createElement('button');
    backgroundButton.textContent = 'Choose Background';
    backgroundButton.addEventListener('click', () => chooseBackgroundCallback(sceneId));
    sceneTools.appendChild(backgroundButton);
  
    // Append scene tools to the toolbar
    const toolbar = document.getElementById('toolbar');
    toolbar.insertAdjacentElement('afterend', sceneTools);
  }
  