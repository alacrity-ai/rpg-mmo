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
    sceneTools.style.justifyContent = 'right';
    sceneTools.style.padding = '5px';
    sceneTools.style.backgroundColor = '#e0e0e0';
    sceneTools.style.width = '100%';
    sceneTools.style.height = '32px'; // Adjust the height for a more compact look
  
    // Button styles
    const buttonStyle = {
      padding: '5px 10px',
      fontSize: '12px',
      margin: '2px',
    };
  
    // Create delete scene button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete Scene';
    Object.assign(deleteButton.style, buttonStyle);
    deleteButton.addEventListener('click', () => deleteSceneCallback(sceneId));
    sceneTools.appendChild(deleteButton);
  
    // Create edit scene button
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit Scene';
    Object.assign(editButton.style, buttonStyle);
    editButton.addEventListener('click', editSceneCallback.bind(null, sceneId));
    sceneTools.appendChild(editButton);
  
    // Create choose background button
    const backgroundButton = document.createElement('button');
    backgroundButton.textContent = 'Choose Background';
    Object.assign(backgroundButton.style, buttonStyle);
    backgroundButton.addEventListener('click', () => chooseBackgroundCallback(sceneId));
    sceneTools.appendChild(backgroundButton);
  
    // Append scene tools to the toolbar
    const toolbar = document.getElementById('toolbar');
    toolbar.insertAdjacentElement('afterend', sceneTools);
  }
  
  export function hideSceneTools() {
    const existingTools = document.getElementById('scene-tools');
    if (existingTools) {
      existingTools.remove();
    }
  }