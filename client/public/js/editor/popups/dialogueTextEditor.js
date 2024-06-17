export function createDialogueTextEditorPopup(node, onApply, onCancel) {
    const popup = document.createElement('div');
    popup.className = 'editor-popup';

    const textArea = document.createElement('textarea');
    textArea.className = 'editor-popup-textarea';
    textArea.value = node.content; // Set the existing content as the initial value
    popup.appendChild(textArea);

    // Add input for dialogue's WAV file path
    const wavInput = document.createElement('input');
    wavInput.className = 'editor-popup-input';
    wavInput.type = 'text';
    wavInput.placeholder = 'folder/dialogue.wav';
    wavInput.value = node.wavPath || ''; // Set the existing WAV path if available
    popup.appendChild(wavInput);

    // Create the help button
    const helpButton = document.createElement('button');
    helpButton.className = 'editor-popup-help-button';
    helpButton.textContent = '❓';
    popup.appendChild(helpButton);

    // Function to show the help popup
    const showHelpPopup = (event) => {
        const helpPopup = document.createElement('div');
        helpPopup.className = 'editor-help-popup';
        helpPopup.innerHTML = `
            <strong>Macro Instructions:</strong><br>
            &#123;&#123; playerName &#125;&#125; - Displays the player's name.<br>
            &#123;&#123; npcName &#125;&#125; - Shows the NPC's name.<br>
            &#123;&#123; playerLevel &#125;&#125; - Shows the player's level.<br>
            &#123;&#123; playerClass &#125;&#125; - Shows the player's class.<br>
            &lt;kw&gt;Keyword here&lt;/kw&gt; - Emphasize text within a &lt;kw&gt;&lt;/kw&gt; block.
        `;
        document.body.appendChild(helpPopup);

        // Position the help popup above the help button
        const buttonRect = helpButton.getBoundingClientRect();
        helpPopup.style.top = `${buttonRect.top + window.scrollY - helpPopup.offsetHeight - 10}px`;
        helpPopup.style.left = `${buttonRect.left + window.scrollX + (buttonRect.width / 2) - (helpPopup.offsetWidth / 2)}px`;
        helpPopup.style.display = 'block';

        // Remove the help popup on mouseout
        helpButton.addEventListener('mouseout', () => {
            helpPopup.style.display = 'none';
            document.body.removeChild(helpPopup);
        }, { once: true });
    };

    helpButton.addEventListener('mouseover', showHelpPopup);

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'editor-popup-button-container';

    const applyButton = document.createElement('button');
    applyButton.className = 'editor-popup-button';
    applyButton.textContent = 'Apply';
    applyButton.addEventListener('click', () => {
        onApply({ content: textArea.value, wavPath: wavInput.value });
        document.body.removeChild(popup);
    });

    const cancelButton = document.createElement('button');
    cancelButton.className = 'editor-popup-button';
    cancelButton.textContent = 'Cancel';
    cancelButton.addEventListener('click', () => {
        onCancel();
        document.body.removeChild(popup);
    });

    buttonContainer.appendChild(applyButton);
    buttonContainer.appendChild(cancelButton);
    popup.appendChild(buttonContainer);

    document.body.appendChild(popup);

    return popup;
}
