// popups/encounterEditor.js

import { Encounter } from '../sceneObjects/encounter.js';

export function createEncounterPopup(sceneData, applyCallback) {
  // Ensure sceneData.encounters is initialized
  if (!sceneData.encounters) {
    sceneData.encounters = [];
  }

  // Create the popup container
  const popup = document.createElement('div');
  popup.id = 'encounter-popup';
  popup.className = 'editor-popup';

  // Create label for current encounters
  const encountersLabel = document.createElement('h3');
  encountersLabel.id = 'encounters-label';
  encountersLabel.textContent = `Current Encounters: ${sceneData.encounters.length > 0 ? sceneData.encounters.map(e => `${e.name} (${Math.round(e.probability * 100)}%)`).join(', ') : '<None>'}`;
  popup.appendChild(encountersLabel);

  // Create dropdown menu for available encounters
  const dropdownLabel = document.createElement('label');
  dropdownLabel.textContent = 'Available Encounters: ';
  popup.appendChild(dropdownLabel);

  const encounterDropdown = document.createElement('select');
  encounterDropdown.id = 'encounter-dropdown';
  encounterDropdown.className = 'editor-popup-dropdown';
  popup.appendChild(encounterDropdown);

  // Fetch encounters from the server and populate the dropdown
  fetch('http://localhost:3000/editor/api/encounters')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      data.forEach(encounter => {
        const option = document.createElement('option');
        option.value = encounter.name;
        option.textContent = encounter.name;
        encounterDropdown.appendChild(option);
      });
    })
    .catch(error => {
      console.error('Error fetching encounters:', error);
    });

  // Create slider for probability
  const sliderLabel = document.createElement('label');
  sliderLabel.textContent = 'Probability: ';
  sliderLabel.style.marginTop = '10px'; // Add some margin to the top for spacing
  popup.appendChild(sliderLabel);

  const probabilitySlider = document.createElement('input');
  probabilitySlider.type = 'range';
  probabilitySlider.min = '0';
  probabilitySlider.max = '1';
  probabilitySlider.step = '0.05';
  probabilitySlider.value = '1';
  probabilitySlider.className = 'editor-popup-slider';
  popup.appendChild(probabilitySlider);

  const sliderValueLabel = document.createElement('span');
  sliderValueLabel.textContent = '100%';
  probabilitySlider.addEventListener('input', () => {
    sliderValueLabel.textContent = `${Math.round(probabilitySlider.value * 100)}%`;
  });
  popup.appendChild(sliderValueLabel);

  // Create container for buttons
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'editor-popup-button-container';
  buttonContainer.style.marginTop = '20px'; // Add margin to the top for spacing

  // Function to calculate total probability
  const calculateTotalProbability = () => {
    return sceneData.encounters.reduce((total, encounter) => total + encounter.probability, 0);
  };

  // Create Add Encounter button
  const addEncounterButton = document.createElement('button');
  addEncounterButton.textContent = 'Add Encounter';
  addEncounterButton.className = 'editor-popup-button';
  addEncounterButton.addEventListener('click', () => {
    const selectedEncounter = encounterDropdown.value;
    const selectedProbability = parseFloat(probabilitySlider.value);
    if (selectedEncounter && !sceneData.encounters.some(e => e.name === selectedEncounter)) {
      const totalProbability = calculateTotalProbability() + selectedProbability;
      if (totalProbability <= 1) {
        sceneData.encounters.push(new Encounter(selectedEncounter, selectedProbability));
        encountersLabel.textContent = `Current Encounters: ${sceneData.encounters.map(e => `${e.name} (${Math.round(e.probability * 100)}%)`).join(', ')}`;
      } else {
        alert('Total probability exceeds 100%. Please adjust the probability.');
      }
    }
  });
  buttonContainer.appendChild(addEncounterButton);

  // Create Remove Encounter button
  const removeEncounterButton = document.createElement('button');
  removeEncounterButton.textContent = 'Remove Encounter';
  removeEncounterButton.className = 'editor-popup-button';
  removeEncounterButton.addEventListener('click', () => {
    if (sceneData.encounters.length > 0) {
      sceneData.encounters.pop();
      encountersLabel.textContent = `Current Encounters: ${sceneData.encounters.length > 0 ? sceneData.encounters.map(e => `${e.name} (${Math.round(e.probability * 100)}%)`).join(', ') : '<None>'}`;
    }
  });
  buttonContainer.appendChild(removeEncounterButton);

  // Create Apply button
  const applyButton = document.createElement('button');
  applyButton.textContent = 'Apply';
  applyButton.className = 'editor-popup-button';
  applyButton.addEventListener('click', () => {
    applyCallback(sceneData);
    document.body.removeChild(popup);
  });
  buttonContainer.appendChild(applyButton);

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
}
