export function createDialogueActionEditorPopup(node, onApply, onCancel) {
    // Create the main popup container
    const popup = document.createElement('div');
    popup.className = 'editor-popup';

    // Create a container for the action rows
    const actionsContainer = document.createElement('div');
    actionsContainer.className = 'editor-popup-actions-container';
    popup.appendChild(actionsContainer);

    // Define the types of actions available with their placeholders
    const actionTypes = [
        { type: 'setFlag', placeholder: 'flagName' },
        { type: 'giveGold', placeholder: 'amount' },
        { type: 'takeGold', placeholder: 'amount' },
        { type: 'giveItem', placeholder: 'itemName' },
        { type: 'takeItem', placeholder: 'itemName' },
        { type: 'giveExp', placeholder: 'amount' },
        { type: 'changeZone', placeholder: 'zoneKey' },
        { type: 'changeScene', placeholder: 'sceneKey' },
        { type: 'playSound', placeholder: 'folder/sound.wav' },
        { type: 'runScript', placeholder: 'scriptName.js' }
    ];

    // Function to create a new row for an action
    const createActionRow = (action = {}) => {
        const actionWrapper = document.createElement('div');
        actionWrapper.className = 'action-wrapper';

        // Create a dropdown for selecting action type
        const dropdown = document.createElement('select');
        dropdown.className = 'editor-popup-dropdown';
        actionTypes.forEach(({ type }) => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            dropdown.appendChild(option);
        });
        dropdown.value = Object.keys(action)[0] || actionTypes[0].type;
        actionWrapper.appendChild(dropdown);

        // Create an input field for the action value
        const input = document.createElement('input');
        input.className = 'editor-popup-input';
        input.value = Object.values(action)[0] || '';
        input.placeholder = actionTypes.find(({ type }) => type === dropdown.value).placeholder;
        input.type = ['setFlag', 'giveItem', 'takeItem', 'changeZone', 'changeScene', 'playSound', 'runScript'].includes(dropdown.value) ? 'text' : 'number';
        actionWrapper.appendChild(input);

        // Change input type and placeholder based on the selected action
        dropdown.addEventListener('change', () => {
            input.type = ['setFlag', 'giveItem', 'takeItem', 'changeZone', 'changeScene', 'playSound', 'runScript'].includes(dropdown.value) ? 'text' : 'number';
            input.placeholder = actionTypes.find(({ type }) => type === dropdown.value).placeholder;
        });

        // Add button to add a new action row
        const addButton = document.createElement('button');
        addButton.className = 'editor-popup-button add-action-button';
        addButton.textContent = '+';
        actionWrapper.appendChild(addButton);

        addButton.addEventListener('click', (event) => {
            event.stopPropagation();
            createActionRow();
            updatePlusButtonVisibility();
            updateMinusButtonVisibility();
        });

        // Add remove button for the current action row if there's more than one row
        const removeButton = document.createElement('button');
        removeButton.className = 'editor-popup-button remove-action-button';
        removeButton.textContent = '-';
        actionWrapper.appendChild(removeButton);

        removeButton.addEventListener('click', (event) => {
            event.stopPropagation();
            actionsContainer.removeChild(actionWrapper);
            updatePlusButtonVisibility();
            updateMinusButtonVisibility();
        });

        // Append the action row to the actions container
        actionsContainer.appendChild(actionWrapper);
        updatePlusButtonVisibility();
        updateMinusButtonVisibility();
    };

    // Function to ensure the plus button is visible only on the last row
    const updatePlusButtonVisibility = () => {
        const wrappers = actionsContainer.querySelectorAll('.action-wrapper');
        wrappers.forEach((wrapper, index) => {
            const addButton = wrapper.querySelector('.add-action-button');
            if (addButton) {
                addButton.style.display = index === wrappers.length - 1 ? 'inline-block' : 'none';
            }
        });
    };

    // Function to ensure the minus button is not visible on the first row or when there's only one row left
    const updateMinusButtonVisibility = () => {
        const wrappers = actionsContainer.querySelectorAll('.action-wrapper');
        wrappers.forEach((wrapper, index) => {
            const removeButton = wrapper.querySelector('.remove-action-button');
            if (removeButton) {
                removeButton.style.display = wrappers.length === 1 || index === 0 ? 'none' : 'inline-block';
            }
        });
    };

    // Create action rows for existing actions or a new one if there are no actions
    node.actions.forEach(action => createActionRow(action));
    if (node.actions.length === 0) createActionRow();

    // Create container for apply and cancel buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'editor-popup-button-container';

    // Create the apply button
    const applyButton = document.createElement('button');
    applyButton.className = 'editor-popup-button';
    applyButton.textContent = 'Apply';
    applyButton.addEventListener('click', () => {
        const actions = Array.from(actionsContainer.querySelectorAll('.action-wrapper')).map(wrapper => {
            const dropdown = wrapper.querySelector('select');
            const input = wrapper.querySelector('input');
            return { [dropdown.value]: input.value };
        }).filter(action => Object.values(action)[0]); // Filter out empty actions
        onApply(actions);
        document.body.removeChild(popup); // Remove popup from the DOM
    });

    // Create the cancel button
    const cancelButton = document.createElement('button');
    cancelButton.className = 'editor-popup-button';
    cancelButton.textContent = 'Cancel';
    cancelButton.addEventListener('click', () => {
        onCancel();
        document.body.removeChild(popup); // Remove popup from the DOM
    });

    // Append apply and cancel buttons to the button container
    buttonContainer.appendChild(applyButton);
    buttonContainer.appendChild(cancelButton);
    popup.appendChild(buttonContainer);

    // Append the popup to the document body
    document.body.appendChild(popup);

    return popup;
}
