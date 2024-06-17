// popups/npcEditor.js

export function createNPCPopup(npc, applyCallback) {
  // Create the popup container
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
  popup.style.display = 'flex';
  popup.style.flexDirection = 'column';
  popup.style.alignItems = 'center';
  popup.style.gap = '10px'; // Add gap between elements

  // Create input for NPC name
  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.placeholder = 'NPC Name';
  nameInput.value = npc.name || '';
  nameInput.id = 'npc-name';
  nameInput.style.width = '100%'; // Full width input
  popup.appendChild(nameInput);

  // Create form elements for each attribute
  const attributes = ['x', 'y', 'path', 'scale', 'flipped'];
  const inputs = {};
  attributes.forEach(attr => {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.justifyContent = 'space-between';
    container.style.alignItems = 'center';
    container.style.width = '100%';

    const label = document.createElement('label');
    label.textContent = `${attr}: `;
    container.appendChild(label);

    const input = document.createElement('input');
    input.type = attr === 'path' ? 'text' : (attr === 'flipped' ? 'checkbox' : 'number');
    input.value = npc[attr];
    input.id = `npc-${attr}`;
    input.style.flexGrow = '1'; // Grow input to take remaining space
    if (attr === 'flipped') {
      input.checked = npc[attr];
    }
    inputs[attr] = input;
    container.appendChild(input);

    popup.appendChild(container);

    // Add sliders for x and y
    if (attr === 'x' || attr === 'y') {
      const sliderContainer = document.createElement('div');
      sliderContainer.style.display = 'flex';
      sliderContainer.style.alignItems = 'center';
      sliderContainer.style.width = '100%';

      const slider = document.createElement('input');
      slider.type = 'range';
      slider.min = attr === 'x' ? '0' : '0';
      slider.max = attr === 'x' ? '1000' : '562';
      slider.step = '1';
      slider.value = npc[attr];
      slider.id = `slider-${attr}`;
      slider.style.width = '100%';
      slider.addEventListener('input', (event) => {
        input.value = event.target.value;
      });
      input.addEventListener('input', (event) => {
        slider.value = event.target.value;
      });
      inputs[`slider-${attr}`] = slider;
      sliderContainer.appendChild(slider);
      popup.appendChild(sliderContainer);
    }

    // Add slider for scale
    if (attr === 'scale') {
      const sliderContainer = document.createElement('div');
      sliderContainer.style.display = 'flex';
      sliderContainer.style.alignItems = 'center';
      sliderContainer.style.width = '100%';

      const slider = document.createElement('input');
      slider.type = 'range';
      slider.min = '0.1';
      slider.max = '4';
      slider.step = '0.01'; // Precision for scale
      slider.value = npc[attr];
      slider.id = `slider-${attr}`;
      slider.style.width = '100%';
      slider.addEventListener('input', (event) => {
        input.value = event.target.value;
      });
      input.addEventListener('input', (event) => {
        slider.value = event.target.value;
      });
      inputs[`slider-${attr}`] = slider;
      sliderContainer.appendChild(slider);
      popup.appendChild(sliderContainer);
    }
  });

  // Add Dialogue button
  const dialogueContainer = document.createElement('div');
  dialogueContainer.style.display = 'flex';
  dialogueContainer.style.justifyContent = 'space-between';
  dialogueContainer.style.alignItems = 'center';
  dialogueContainer.style.width = '100%';

  const dialogueLabel = document.createElement('p');
  dialogueContainer.appendChild(dialogueLabel);

  const dialogueButton = document.createElement('button');
  updateDialogueButtonAndLabel();

  dialogueContainer.appendChild(dialogueButton);
  popup.appendChild(dialogueContainer);

  // Create hidden file input for loading JSON
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'application/json';
  fileInput.style.display = 'none';
  fileInput.addEventListener('change', (event) => handleFileLoad(event, npc, updateDialogueButtonAndLabel));
  popup.appendChild(fileInput);

  // Create buttons container
  const buttonsContainer = document.createElement('div');
  buttonsContainer.style.display = 'flex';
  buttonsContainer.style.justifyContent = 'space-between';
  buttonsContainer.style.width = '100%';

  // Create Apply button
  const applyButton = document.createElement('button');
  applyButton.textContent = 'Apply';
  applyButton.style.flexGrow = '1'; // Grow to take equal space
  applyButton.addEventListener('click', () => {
    const updatedNPC = {
      name: nameInput.value // Add the name input value to the updated NPC object
    };
    attributes.forEach(attr => {
      const value = inputs[attr].type === 'checkbox' ? inputs[attr].checked : inputs[attr].value;
      updatedNPC[attr] = attr === 'path' ? value : (attr === 'flipped' ? value : parseFloat(value));
    });
    updatedNPC.dialogue = npc.dialogue;
    updatedNPC.dialogueFilename = npc.dialogueFilename;
    applyCallback(updatedNPC);
    document.body.removeChild(popup);
  });
  buttonsContainer.appendChild(applyButton);

  // Create Cancel button
  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Cancel';
  cancelButton.style.flexGrow = '1'; // Grow to take equal space
  cancelButton.addEventListener('click', () => {
    document.body.removeChild(popup);
  });
  buttonsContainer.appendChild(cancelButton);

  popup.appendChild(buttonsContainer);

  // Append the popup to the body
  document.body.appendChild(popup);

  function updateDialogueButtonAndLabel() {
    if (npc.dialogue) {
      dialogueButton.textContent = 'Remove Dialogue';
      dialogueButton.onclick = () => {
        npc.dialogue = null;
        npc.dialogueFilename = null;
        updateDialogueButtonAndLabel();
      };
      dialogueLabel.textContent = `Dialogue File: ${npc.dialogueFilename}`;
    } else {
      dialogueButton.textContent = 'Add Dialogue';
      dialogueButton.onclick = () => fileInput.click();
      dialogueLabel.textContent = 'Dialogue File: None';
    }
  }
}

function handleFileLoad(event, npc, updateDialogueButtonAndLabel) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
      npc.dialogue = e.target.result;
      npc.dialogueFilename = file.name;
      alert('Dialogue loaded successfully');
      updateDialogueButtonAndLabel();
  };
  reader.readAsText(file);
}
