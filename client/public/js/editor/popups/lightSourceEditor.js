// popups/lightSourceEditor.js
export function createLightSourcePopup(lightSource, applyCallback) {
  // Create the popup container
  const popup = document.createElement('div');
  popup.id = 'light-source-popup';
  popup.style.position = 'fixed';
  popup.style.top = '50%';
  popup.style.left = '50%';
  popup.style.transform = 'translate(-50%, -50%)';
  popup.style.padding = '20px';
  popup.style.backgroundColor = '#fff';
  popup.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
  popup.style.zIndex = '1000'; // Ensure the popup is on top

  // Create form elements for each attribute
  const attributes = ['x', 'y', 'color', 'radius', 'intensity', 'pulsate', 'minIntensity', 'maxIntensity'];
  const inputs = {};
  attributes.forEach(attr => {
    const label = document.createElement('label');
    label.textContent = `${attr}: `;
    const input = document.createElement('input');
    input.type = attr === 'color' ? 'color' : (attr === 'pulsate' ? 'checkbox' : 'number');
    input.value = lightSource[attr];
    input.id = `light-source-${attr}`;
    if (attr === 'pulsate') {
      input.checked = lightSource[attr];
    }
    inputs[attr] = input;
    label.appendChild(input);
    popup.appendChild(label);
    popup.appendChild(document.createElement('br'));

    // Add slider for radius, intensity, minIntensity, and maxIntensity
    if (['radius', 'intensity', 'minIntensity', 'maxIntensity'].includes(attr)) {
      const slider = document.createElement('input');
      slider.type = 'range';
      slider.min = '0';
      slider.max = attr === 'radius' ? '500' : '1'; // Adjust max value as needed
      slider.step = '0.01'; // Precision for intensity
      slider.value = lightSource[attr];
      slider.id = `slider-${attr}`;
      slider.style.width = '100%';
      slider.disabled = (attr === 'minIntensity' || attr === 'maxIntensity') && !lightSource.pulsate;
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

  // Pulsate checkbox event
  inputs.pulsate.addEventListener('change', (event) => {
    inputs['slider-minIntensity'].disabled = !event.target.checked;
    inputs['slider-maxIntensity'].disabled = !event.target.checked;
  });

  // Create Apply button
  const applyButton = document.createElement('button');
  applyButton.textContent = 'Apply';
  applyButton.addEventListener('click', () => {
    const updatedLightSource = {};
    attributes.forEach(attr => {
      const value = inputs[attr].type === 'checkbox' ? inputs[attr].checked : inputs[attr].value;
      updatedLightSource[attr] = attr === 'color' ? value : (attr === 'pulsate' ? value : parseFloat(value));
    });
    applyCallback(updatedLightSource);
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
}