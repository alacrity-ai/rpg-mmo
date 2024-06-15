// ./popups/dialogueConditionEditor.js

export function createDialogueConditionEditorPopup(node, onApply, onCancel) {
    // Create the main popup container
    const popup = document.createElement('div');
    popup.className = 'editor-popup';

    // Create a container for the condition rows
    const conditionsContainer = document.createElement('div');
    conditionsContainer.className = 'editor-popup-conditions-container';
    popup.appendChild(conditionsContainer);

    // Define the types of conditions available
    const conditionTypes = ['Has Flag', 'Level atleast', 'Gold atleast', 'Has Item', 'Random Chance'];

    // Function to create a new row for a condition
    const createConditionRow = (condition = {}) => {
        const conditionWrapper = document.createElement('div');
        conditionWrapper.className = 'action-wrapper'; // Reuse the existing class

        // Create a dropdown for selecting condition type
        const dropdown = document.createElement('select');
        dropdown.className = 'editor-popup-dropdown';
        conditionTypes.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            dropdown.appendChild(option);
        });
        dropdown.value = Object.keys(condition)[0] || conditionTypes[0];
        conditionWrapper.appendChild(dropdown);

        // Create an input field for the condition value
        const input = document.createElement('input');
        input.className = 'editor-popup-input';
        input.value = Object.values(condition)[0] || '';
        input.type = ['Has Flag', 'Has Item'].includes(dropdown.value) ? 'text' : 'number';
        conditionWrapper.appendChild(input);

        // Change input type based on the selected condition
        dropdown.addEventListener('change', () => {
            input.type = ['Has Flag', 'Has Item'].includes(dropdown.value) ? 'text' : 'number';
        });

        // Add button to add a new condition row
        const addButton = document.createElement('button');
        addButton.className = 'editor-popup-button add-action-button';
        addButton.textContent = '+';
        conditionWrapper.appendChild(addButton);

        addButton.addEventListener('click', (event) => {
            event.stopPropagation();
            const maxConditions = node.children.length;
            if (conditionsContainer.children.length >= maxConditions) { // Adjusting for the initial row allowed at 0 children
                alert('Create another child element to add another condition');
            } else {
                createConditionRow();
                updatePlusButtonVisibility();
                updateMinusButtonVisibility();
            }
        });

        // Add remove button for the current condition row if there's more than one row
        const removeButton = document.createElement('button');
        removeButton.className = 'editor-popup-button remove-action-button';
        removeButton.textContent = '-';
        conditionWrapper.appendChild(removeButton);

        removeButton.addEventListener('click', (event) => {
            event.stopPropagation();
            conditionsContainer.removeChild(conditionWrapper);
            updatePlusButtonVisibility();
            updateMinusButtonVisibility();
        });

        // Append the condition row to the conditions container
        conditionsContainer.appendChild(conditionWrapper);
        updatePlusButtonVisibility();
        updateMinusButtonVisibility();
    };

    // Function to ensure the plus button is visible only on the last row
    const updatePlusButtonVisibility = () => {
        const wrappers = conditionsContainer.querySelectorAll('.action-wrapper');
        wrappers.forEach((wrapper, index) => {
            const addButton = wrapper.querySelector('.add-action-button');
            if (addButton) {
                const maxConditions = node.children.length;
                addButton.style.display = (index === wrappers.length - 1 && wrappers.length <= maxConditions) ? 'inline-block' : 'none';
            }
        });
    };

    // Function to ensure the minus button is not visible on the first row or when there's only one row left
    const updateMinusButtonVisibility = () => {
        const wrappers = conditionsContainer.querySelectorAll('.action-wrapper');
        wrappers.forEach((wrapper, index) => {
            const removeButton = wrapper.querySelector('.remove-action-button');
            if (removeButton) {
                removeButton.style.display = wrappers.length === 1 || index === 0 ? 'none' : 'inline-block';
            }
        });
    };

    // Create condition rows for existing conditions or a new one if there are no conditions
    node.conditions.forEach(condition => createConditionRow(condition));
    if (node.conditions.length === 0) createConditionRow();

    // Create container for apply and cancel buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'editor-popup-button-container';

    // Create the apply button
    const applyButton = document.createElement('button');
    applyButton.className = 'editor-popup-button';
    applyButton.textContent = 'Apply';
    applyButton.addEventListener('click', () => {
        const conditions = Array.from(conditionsContainer.querySelectorAll('.action-wrapper')).map(wrapper => {
            const dropdown = wrapper.querySelector('select');
            const input = wrapper.querySelector('input');
            return { [dropdown.value]: input.value };
        }).filter(condition => Object.values(condition)[0]); // Filter out empty conditions
        onApply(conditions);
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
