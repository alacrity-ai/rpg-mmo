// popups/audioEditor.js
export function createAudioPopup(audioData, allScenes, applyCallback) {
    // Array to keep track of all playing audio elements
    const playingAudios = [];
  
    // Function to stop all currently playing sounds
    function stopAllPlayingSounds() {
      playingAudios.forEach(audio => {
        audio.pause();
        audio.currentTime = 0; // Reset the audio to the beginning
      });
      playingAudios.length = 0; // Clear the array
    }
  
    // Create the popup container
    const popup = document.createElement('div');
    popup.id = 'audio-popup';
    popup.className = 'editor-popup';
  
    // Create label for background music
    const musicLabel = document.createElement('label');
    musicLabel.textContent = 'Background Music: ';
    popup.appendChild(musicLabel);
  
    // Create dropdown menu for background music
    const musicDropdown = document.createElement('select');
    musicDropdown.id = 'music-dropdown';
    musicDropdown.className = 'editor-popup-dropdown';
    popup.appendChild(musicDropdown);
  
    // Add "(No Music)" option
    const noMusicOption = document.createElement('option');
    noMusicOption.value = '';
    noMusicOption.textContent = '(No Music)';
    musicDropdown.appendChild(noMusicOption);
  
    // Fetch music from the server and populate the dropdown
    fetch('http://localhost:8001/api/music/zones')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        data.forEach(musicPath => {
          const option = document.createElement('option');
          option.value = musicPath;
          option.textContent = musicPath.split('/').pop();
          musicDropdown.appendChild(option);
        });
        if (audioData.music) {
          musicDropdown.value = audioData.music;
        }
      })
      .catch(error => {
        console.error('Error fetching music:', error);
      });
  
    // Create play button for background music
    const playMusicButton = document.createElement('button');
    playMusicButton.textContent = 'Play';
    playMusicButton.className = 'editor-popup-button';
    playMusicButton.addEventListener('click', () => {
      stopAllPlayingSounds(); // Stop any currently playing sounds
      const selectedMusic = musicDropdown.value;
      if (selectedMusic) {
        const audio = new window.Audio(selectedMusic);
        playingAudios.push(audio); // Track the audio element
        audio.play();
      }
    });
    popup.appendChild(playMusicButton);
  
    popup.appendChild(document.createElement('br'));
  
    // Create label for ambient sound
    const ambientLabel = document.createElement('label');
    ambientLabel.textContent = 'Ambient Sound: ';
    popup.appendChild(ambientLabel);
  
    // Create dropdown menu for ambient sound
    const ambientDropdown = document.createElement('select');
    ambientDropdown.id = 'ambient-dropdown';
    ambientDropdown.className = 'editor-popup-dropdown';
    popup.appendChild(ambientDropdown);
  
    // Add "(No Sound)" option
    const noSoundOption = document.createElement('option');
    noSoundOption.value = '';
    noSoundOption.textContent = '(No Sound)';
    ambientDropdown.appendChild(noSoundOption);
  
    // Fetch ambient sounds from the server and populate the dropdown
    fetch('http://localhost:8001/api/sounds/ambient')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        data.forEach(ambientPath => {
          const option = document.createElement('option');
          option.value = ambientPath;
          option.textContent = ambientPath.split('/').pop();
          ambientDropdown.appendChild(option);
        });
        if (audioData.ambientSound) {
          ambientDropdown.value = audioData.ambientSound;
        }
      })
      .catch(error => {
        console.error('Error fetching ambient sounds:', error);
      });
  
    // Create play button for ambient sound
    const playAmbientButton = document.createElement('button');
    playAmbientButton.textContent = 'Play';
    playAmbientButton.className = 'editor-popup-button';
    playAmbientButton.addEventListener('click', () => {
      stopAllPlayingSounds(); // Stop any currently playing sounds
      const selectedAmbient = ambientDropdown.value;
      if (selectedAmbient) {
        const audio = new window.Audio(selectedAmbient);
        playingAudios.push(audio); // Track the audio element
        audio.play();
      }
    });
    popup.appendChild(playAmbientButton);
  
    popup.appendChild(document.createElement('br'));
  
    // Create container for buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'editor-popup-button-container';
    buttonContainer.style.marginTop = '20px'; // Add margin to the top for spacing
  
    // Create Apply button
    const applyButton = document.createElement('button');
    applyButton.textContent = 'Apply';
    applyButton.className = 'editor-popup-button';
    applyButton.addEventListener('click', () => {
      stopAllPlayingSounds(); // Stop all sounds when applying
      audioData.music = musicDropdown.value || null; // Set to null if no music selected
      audioData.ambientSound = ambientDropdown.value || null; // Set to null if no sound selected
      applyCallback(audioData);
      document.body.removeChild(popup);
    });
    buttonContainer.appendChild(applyButton);
  
    // Create Apply to All button
    const applyToAllButton = document.createElement('button');
    applyToAllButton.textContent = 'Apply to All Scenes';
    applyToAllButton.className = 'editor-popup-button';
    applyToAllButton.addEventListener('click', () => {
      stopAllPlayingSounds(); // Stop all sounds when applying
      const newAudioSettings = {
        music: musicDropdown.value || null,
        ambientSound: ambientDropdown.value || null,
      };
      for (const sceneKey in allScenes) {
        allScenes[sceneKey].audio = { ...newAudioSettings };
      }
      applyCallback(newAudioSettings);
      document.body.removeChild(popup);
    });
    buttonContainer.appendChild(applyToAllButton);
  
    // Create Cancel button
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.className = 'editor-popup-button';
    cancelButton.addEventListener('click', () => {
      stopAllPlayingSounds(); // Stop all sounds when canceling
      document.body.removeChild(popup);
    });
    buttonContainer.appendChild(cancelButton);
  
    // Append button container to popup
    popup.appendChild(buttonContainer);
  
    // Append the popup to the body
    document.body.appendChild(popup);
  }
  