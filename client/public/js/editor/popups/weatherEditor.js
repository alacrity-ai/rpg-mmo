// popups/weatherEditor.js

import { Weather } from '../sceneObjects/weather.js';

export function createWeatherPopup(sceneData, allScenes, applyCallback) {
  // Ensure sceneData.weather is initialized
  if (!sceneData.weather) {
    sceneData.weather = new Weather();
  }

  const weather = sceneData.weather;
  // Ensure default values
  if (weather.fog === undefined) weather.fog = false;
  if (weather.fogBrightness === undefined) weather.fogBrightness = 1;
  if (weather.fogThickness === undefined) weather.fogThickness = 1;
  if (weather.fogSpeed === undefined) weather.fogSpeed = 1;

  // Create the popup container
  const popup = document.createElement('div');
  popup.id = 'weather-popup';
  popup.className = 'editor-popup';

  // Create checkbox for fog
  const fogLabel = document.createElement('label');
  fogLabel.textContent = 'Enable Fog: ';
  popup.appendChild(fogLabel);

  const fogCheckbox = document.createElement('input');
  fogCheckbox.type = 'checkbox';
  fogCheckbox.checked = weather.fog;
  fogLabel.appendChild(fogCheckbox);

  // Create container for fog settings
  const fogSettingsContainer = document.createElement('div');
  fogSettingsContainer.style.display = weather.fog ? 'block' : 'none';
  popup.appendChild(fogSettingsContainer);

  // Create slider for fog brightness
  const brightnessLabel = document.createElement('label');
  brightnessLabel.textContent = 'Fog Brightness: ';
  fogSettingsContainer.appendChild(brightnessLabel);

  const brightnessSlider = document.createElement('input');
  brightnessSlider.type = 'range';
  brightnessSlider.min = '0';
  brightnessSlider.max = '1';
  brightnessSlider.step = '0.01';
  brightnessSlider.value = weather.fogBrightness;
  brightnessLabel.appendChild(brightnessSlider);

  const brightnessValue = document.createElement('span');
  brightnessValue.textContent = weather.fogBrightness;
  brightnessSlider.addEventListener('input', () => {
    brightnessValue.textContent = brightnessSlider.value;
  });
  brightnessLabel.appendChild(brightnessValue);

  fogSettingsContainer.appendChild(document.createElement('br'));

  // Create slider for fog thickness
  const thicknessLabel = document.createElement('label');
  thicknessLabel.textContent = 'Fog Thickness: ';
  fogSettingsContainer.appendChild(thicknessLabel);

  const thicknessSlider = document.createElement('input');
  thicknessSlider.type = 'range';
  thicknessSlider.min = '0';
  thicknessSlider.max = '1';
  thicknessSlider.step = '0.01';
  thicknessSlider.value = weather.fogThickness;
  thicknessLabel.appendChild(thicknessSlider);

  const thicknessValue = document.createElement('span');
  thicknessValue.textContent = weather.fogThickness;
  thicknessSlider.addEventListener('input', () => {
    thicknessValue.textContent = thicknessSlider.value;
  });
  thicknessLabel.appendChild(thicknessValue);

  fogSettingsContainer.appendChild(document.createElement('br'));

  // Create slider for fog speed
  const speedLabel = document.createElement('label');
  speedLabel.textContent = 'Fog Speed: ';
  fogSettingsContainer.appendChild(speedLabel);

  const speedSlider = document.createElement('input');
  speedSlider.type = 'range';
  speedSlider.min = '0';
  speedSlider.max = '10';
  speedSlider.step = '0.1';
  speedSlider.value = weather.fogSpeed;
  speedLabel.appendChild(speedSlider);

  const speedValue = document.createElement('span');
  speedValue.textContent = weather.fogSpeed;
  speedSlider.addEventListener('input', () => {
    speedValue.textContent = speedSlider.value;
  });
  speedLabel.appendChild(speedValue);

  // Toggle fog settings visibility based on checkbox
  fogCheckbox.addEventListener('change', () => {
    fogSettingsContainer.style.display = fogCheckbox.checked ? 'block' : 'none';
  });

  // Create container for buttons
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'editor-popup-button-container';
  buttonContainer.style.marginTop = '20px'; // Add margin to the top for spacing

  // Create Apply button
  const applyButton = document.createElement('button');
  applyButton.textContent = 'Apply';
  applyButton.className = 'editor-popup-button';
  applyButton.addEventListener('click', () => {
    applyWeatherSettings(sceneData);
    applyCallback(sceneData);
    document.body.removeChild(popup);
  });
  buttonContainer.appendChild(applyButton);

  // Create Apply to All button
  const applyToAllButton = document.createElement('button');
  applyToAllButton.textContent = 'Apply to All Scenes';
  applyToAllButton.className = 'editor-popup-button';
  applyToAllButton.addEventListener('click', () => {
    for (const sceneKey in allScenes) {
      applyWeatherSettings(allScenes[sceneKey]);
    }
    applyWeatherSettings(sceneData); // Ensure current scene is updated as well
    applyCallback(sceneData);
    document.body.removeChild(popup);
  });
  buttonContainer.appendChild(applyToAllButton);

  // Create Cancel button
  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Cancel';
  cancelButton.className = 'editor-popup-button';
  cancelButton.addEventListener('click', () => {
    document.body.removeChild(popup);
  });
  buttonContainer.appendChild(cancelButton);

  // Append button container to popup
  popup.appendChild(buttonContainer);

  // Append the popup to the body
  document.body.appendChild(popup);

  // Function to apply weather settings to a scene
  function applyWeatherSettings(scene) {
    if (fogCheckbox.checked) {
      scene.weather = {
        fog: true,
        fogBrightness: parseFloat(brightnessSlider.value),
        fogThickness: parseFloat(thicknessSlider.value),
        fogSpeed: parseFloat(speedSlider.value)
      };
    } else {
      if (scene.weather) {
        delete scene.weather.fog;
        delete scene.weather.fogBrightness;
        delete scene.weather.fogThickness;
        delete scene.weather.fogSpeed;
      }
    }
  }
}
