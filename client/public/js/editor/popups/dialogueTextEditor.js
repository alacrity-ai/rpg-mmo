export function createDialogueTextEditorPopup(node, onApply, onCancel) {
    const popup = document.createElement('div');
    popup.className = 'editor-popup';

    const textArea = document.createElement('textarea');
    textArea.className = 'editor-popup-textarea';
    textArea.value = node.content; // Set the existing content as the initial value
    popup.appendChild(textArea);

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'editor-popup-button-container';

    const applyButton = document.createElement('button');
    applyButton.className = 'editor-popup-button';
    applyButton.textContent = 'Apply';
    applyButton.addEventListener('click', () => {
        onApply(textArea.value);
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
