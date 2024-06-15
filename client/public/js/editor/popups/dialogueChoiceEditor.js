export function createDialogueChoiceEditorPopup(node, onApply, onCancel) {
    const popup = document.createElement('div');
    popup.className = 'editor-popup';

    const choiceInput = document.createElement('input');
    choiceInput.className = 'editor-popup-input';
    choiceInput.value = node.choice; // Set the existing choice as the initial value
    popup.appendChild(choiceInput);

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'editor-popup-button-container';

    const applyButton = document.createElement('button');
    applyButton.className = 'editor-popup-button';
    applyButton.textContent = 'Apply';
    applyButton.addEventListener('click', () => {
        onApply(choiceInput.value);
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
