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

  // Create form elements for each attribute
  const attributes = ['x', 'y', 'path', 'scale', 'flipped'];
  const inputs = {};
  attributes.forEach(attr => {
    const label = document.createElement('label');
    label.textContent = `${attr}: `;
    const input = document.createElement('input');
    input.type = attr === 'path' ? 'text' : (attr === 'flipped' ? 'checkbox' : 'number');
    input.value = npc[attr];
    input.id = `npc-${attr}`;
    if (attr === 'flipped') {
      input.checked = npc[attr];
    }
    inputs[attr] = input;
    label.appendChild(input);
    popup.appendChild(label);
    popup.appendChild(document.createElement('br'));

    // Add slider for scale
    if (attr === 'scale') {
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
      popup.appendChild(slider);
      popup.appendChild(document.createElement('br'));
    }
  });

  // Add Dialogue button
  const dialogueButton = document.createElement('button');
  const dialogueLabel = document.createElement('p');
  updateDialogueButtonAndLabel();

  popup.appendChild(dialogueLabel);
  popup.appendChild(dialogueButton);

  // Create hidden file input for loading JSON
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'application/json';
  fileInput.style.display = 'none';
  fileInput.addEventListener('change', (event) => handleFileLoad(event, npc, updateDialogueButtonAndLabel));
  popup.appendChild(fileInput);

  // Create Apply button
  const applyButton = document.createElement('button');
  applyButton.textContent = 'Apply';
  applyButton.addEventListener('click', () => {
    const updatedNPC = {};
    attributes.forEach(attr => {
      const value = inputs[attr].type === 'checkbox' ? inputs[attr].checked : inputs[attr].value;
      updatedNPC[attr] = attr === 'path' ? value : (attr === 'flipped' ? value : parseFloat(value));
    });
    updatedNPC.dialogue = npc.dialogue;
    updatedNPC.dialogueFilename = npc.dialogueFilename;
    applyCallback(updatedNPC);
    document.body.removeChild(popup);
  });
  popup.appendChild(applyButton);

  // Create Cancel button
  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Cancel';
  cancelButton.addEventListener('click', () => {
    document.body.removeChild(popup);
  });
  popup.appendChild(cancelButton);

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
