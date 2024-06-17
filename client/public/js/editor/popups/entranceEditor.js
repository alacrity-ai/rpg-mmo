// popups/entranceEditor.js

export function createEntrancePopup(entrance, applyCallback, zoneData) {
    // Create the popup container
    const popup = document.createElement('div');
    popup.id = 'entrance-popup';
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
  
    // Create form elements for each attribute
    const attributes = ['x1', 'y1', 'x2', 'y2', 'sceneKey', 'oneWay'];
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
  
      if (attr === 'sceneKey') {
        const select = document.createElement('select');
        Object.keys(zoneData.scenes).forEach(sceneKey => {
          const option = document.createElement('option');
          option.value = sceneKey;
          option.text = sceneKey;
          if (sceneKey === entrance.sceneKey) {
            option.selected = true;
          }
          select.appendChild(option);
        });
        select.id = `entrance-${attr}`;
        select.style.flexGrow = '1'; // Grow select to take remaining space
        inputs[attr] = select;
        container.appendChild(select);
      } else {
        const input = document.createElement('input');
        if (attr === 'oneWay') {
          input.type = 'checkbox';
          input.checked = entrance[attr];
        } else {
          input.type = 'number';
          input.value = entrance[attr];
        }
        input.id = `entrance-${attr}`;
        input.style.flexGrow = '1'; // Grow input to take remaining space
        inputs[attr] = input;
        container.appendChild(input);
      }
  
      popup.appendChild(container);
  
      // Add sliders for x1, y1, x2, y2
      if (['x1', 'y1', 'x2', 'y2'].includes(attr)) {
        const sliderContainer = document.createElement('div');
        sliderContainer.style.display = 'flex';
        sliderContainer.style.alignItems = 'center';
        sliderContainer.style.width = '100%';
  
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = attr.includes('x') ? '0' : '0';
        slider.max = attr.includes('x') ? '1000' : '562';
        slider.step = '1';
        slider.value = entrance[attr];
        slider.id = `slider-${attr}`;
        slider.style.width = '100%';
        slider.addEventListener('input', (event) => {
          inputs[attr].value = event.target.value;
        });
        inputs[attr].addEventListener('input', (event) => {
          slider.value = event.target.value;
        });
        inputs[`slider-${attr}`] = slider;
        sliderContainer.appendChild(slider);
        popup.appendChild(sliderContainer);
      }
    });
  
    // Add checkbox and input for flagLock
    const flagLockContainer = document.createElement('div');
    flagLockContainer.style.display = 'flex';
    flagLockContainer.style.justifyContent = 'space-between';
    flagLockContainer.style.alignItems = 'center';
    flagLockContainer.style.width = '100%';
  
    const flagLockLabel = document.createElement('label');
    flagLockLabel.textContent = 'Flag Lock: ';
    flagLockContainer.appendChild(flagLockLabel);
  
    const flagLockCheckbox = document.createElement('input');
    flagLockCheckbox.type = 'checkbox';
    flagLockCheckbox.checked = entrance.flagLock !== null;
    flagLockCheckbox.id = 'entrance-flagLock';
    flagLockCheckbox.style.flexGrow = '0';
    flagLockContainer.appendChild(flagLockCheckbox);
  
    const flagLockInput = document.createElement('input');
    flagLockInput.type = 'text';
    flagLockInput.value = entrance.flagLock || '';
    flagLockInput.disabled = !flagLockCheckbox.checked;
    flagLockInput.id = 'entrance-flagLock-input';
    flagLockInput.style.flexGrow = '1'; // Grow input to take remaining space
    flagLockContainer.appendChild(flagLockInput);
  
    flagLockCheckbox.addEventListener('change', () => {
      flagLockInput.disabled = !flagLockCheckbox.checked;
    });
  
    inputs['flagLock'] = flagLockInput;
    inputs['flagLockCheckbox'] = flagLockCheckbox;
    popup.appendChild(flagLockContainer);
  
    // Create buttons container
    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.display = 'flex';
    buttonsContainer.style.justifyContent = 'space-between';
    buttonsContainer.style.width = '100%';
  
    // Create Apply button
    const applyButton = document.createElement('button');
    applyButton.textContent = 'Apply';
    applyButton.className = 'editor-popup-button'; // Add the CSS class
    applyButton.style.flexGrow = '1'; // Grow to take equal space
    applyButton.addEventListener('click', () => {
      const updatedEntrance = {};
      attributes.forEach(attr => {
        const value = inputs[attr].type === 'checkbox' ? inputs[attr].checked : inputs[attr].value;
        updatedEntrance[attr] = attr === 'sceneKey' ? value : (attr === 'oneWay' ? value : parseFloat(value));
      });
  
      // Add flagLock value
      updatedEntrance.flagLock = inputs['flagLockCheckbox'].checked ? inputs['flagLock'].value : null;
  
      applyCallback(updatedEntrance);
      document.body.removeChild(popup);
    });
    buttonsContainer.appendChild(applyButton);
  
    // Create Cancel button
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.className = 'editor-popup-button'; // Add the CSS class
    cancelButton.style.flexGrow = '1'; // Grow to take equal space
    cancelButton.addEventListener('click', () => {
      document.body.removeChild(popup);
    });
    buttonsContainer.appendChild(cancelButton);
  
    popup.appendChild(buttonsContainer);
  
    // Append the popup to the body
    document.body.appendChild(popup);
  }
  