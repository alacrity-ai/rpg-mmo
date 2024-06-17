import { connectionRules } from "../dialogue/nodeUtils";

export function createDialogueEditorToolbar(backToSceneEditorCallback, createTextNodeCallback, createChoiceNodeCallback, createActionNodeCallback, createConditionNodeCallback, saveCallback, loadCallback, resetCallback) {
    // Create the dialogue tools container
    const dialogueTools = document.createElement('div');
    dialogueTools.id = 'dialogue-tools';
    dialogueTools.style.display = 'flex';
    dialogueTools.style.justifyContent = 'left';
    dialogueTools.style.alignItems = 'center';
    dialogueTools.style.padding = '5px';
    dialogueTools.style.backgroundColor = '#e0e0e0';
    dialogueTools.style.width = '100%';
    dialogueTools.style.height = '32px'; // Adjust the height for a more compact look

    // Button styles
    const buttonStyle = {
      padding: '5px 10px',
      fontSize: '12px',
      margin: '0 10px 0 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      color: '#fff'
    };

    // Define divider style
    const dividerStyle = {
      width: '1px',
      height: '100%',
      backgroundColor: 'gray',
      margin: '0 10px'
    };

    // Function to create buttons with tooltips
    function createButton(id, text, tooltip, color, eventListener) {
      const button = document.createElement('button');
      button.id = id;
      button.textContent = text;
      Object.assign(button.style, buttonStyle, { backgroundColor: color });
      button.title = tooltip;
      button.addEventListener('click', eventListener);
      return button;
    }

    // Create back button
    const backButton = createButton('back-to-scene-editor-button', 'Back', 'Back to Scene Editor', '#007bff', backToSceneEditorCallback);
    dialogueTools.appendChild(backButton);

    // Add a vertical divider here
    const divider1 = document.createElement('div');
    Object.assign(divider1.style, dividerStyle);
    dialogueTools.appendChild(divider1);

    // Create text button
    const textButton = createButton('text-button', 'Text', 'Create a text node', '#007bff', createTextNodeCallback);
    dialogueTools.appendChild(textButton);

    // Create choice button
    const choiceButton = createButton('choice-button', 'Choice', 'Create a choice node', '#28a745', createChoiceNodeCallback);
    dialogueTools.appendChild(choiceButton);

    // Create action button
    const actionButton = createButton('action-button', 'Action', 'Create an action node', '#6f42c1', createActionNodeCallback);
    dialogueTools.appendChild(actionButton);

    // Create condition button
    const conditionButton = createButton('condition-button', 'Condition', 'Create a condition node', '#fd7e14', createConditionNodeCallback);
    dialogueTools.appendChild(conditionButton);

    // Add a vertical divider here
    const divider2 = document.createElement('div');
    Object.assign(divider2.style, dividerStyle);
    dialogueTools.appendChild(divider2);

    // Create save button
    const saveButton = createButton('save-button', 'Save', 'Save the conversation tree', '#17a2b8', saveCallback);
    dialogueTools.appendChild(saveButton);

    // Create load button
    const loadButton = createButton('load-button', 'Load', 'Load a conversation tree', '#17a2b8', () => fileInput.click());
    dialogueTools.appendChild(loadButton);

    // Create hidden file input for loading JSON
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'application/json';
    fileInput.style.display = 'none';
    fileInput.addEventListener('change', loadCallback);
    dialogueTools.appendChild(fileInput);

    // Add a vertical divider here
    const divider3 = document.createElement('div');
    Object.assign(divider3.style, dividerStyle);
    dialogueTools.appendChild(divider3);

    // Create reset button
    const resetButton = createButton('reset-button', 'Reset', 'Reset the conversation tree', '#dc3545', resetCallback);
    dialogueTools.appendChild(resetButton);

    return dialogueTools;
}


export function updateDialogueEditorToolbar(selectedNode) {
    // Get the dialogue tools container
    const dialogueTools = document.getElementById('dialogue-tools');
    if (!dialogueTools) return;

    // Define the button IDs and their corresponding node types
    const buttonNodeTypeMap = {
        'text-button': 'textnode',
        'choice-button': 'choicenode',
        'action-button': 'actionnode',
        'condition-button': 'conditionnode'
    };

    // Declare the allowedNodeTypes variable
    let allowedNodeTypes = [];

    const selectedNodeType = selectedNode.constructor.name.toLowerCase();
    const hasConditionChild = selectedNode.children.some(child => child.constructor.name.toLowerCase() === 'conditionnode');
    const hasNonConditionChild = selectedNode.children.some(child => child.constructor.name.toLowerCase() !== 'conditionnode');
    const hasChoiceChild = selectedNode.children.some(child => child.constructor.name.toLowerCase() === 'choicenode');
    const hasNonChoiceChild = selectedNode.children.some(child => child.constructor.name.toLowerCase() !== 'choicenode');
    const hasTextOrActionChild = selectedNode.children.some(child => ['textnode', 'actionnode'].includes(child.constructor.name.toLowerCase()));

    switch (selectedNodeType) {
        case 'startnode':
            allowedNodeTypes = selectedNode.children.length === 0 ? connectionRules.startnode : [];
            break;
        case 'choicenode':
            if (hasNonConditionChild) {
                allowedNodeTypes = [];
            } else if (hasConditionChild) {
                allowedNodeTypes = ['conditionnode'];
            } else {
                allowedNodeTypes = connectionRules.choicenode;
            }
            break;
        case 'textnode':
            if (hasChoiceChild) {
                allowedNodeTypes = ['choicenode'];
            } else if (hasConditionChild) {
                allowedNodeTypes = ['conditionnode'];
            } else if (selectedNode.children.length === 0) {
                allowedNodeTypes = connectionRules.textnode;
            } else {
                allowedNodeTypes = [];
            }
            break;
        case 'actionnode':
            if (hasNonConditionChild) {
                allowedNodeTypes = [];
            } else if (hasConditionChild) {
                allowedNodeTypes = ['conditionnode'];
            } else {
                allowedNodeTypes = connectionRules.actionnode;
            }
            break;
        case 'conditionnode':
            allowedNodeTypes = hasTextOrActionChild ? [] : ['textnode', 'actionnode'];
            break;
        default:
            allowedNodeTypes = [];
    }

    // Iterate through each button and enable/disable based on the allowed node types
    for (const [buttonId, nodeType] of Object.entries(buttonNodeTypeMap)) {
        const button = document.getElementById(buttonId);
        if (button) {
            if (allowedNodeTypes.includes(nodeType)) {
                button.disabled = false;
                button.style.opacity = '1'; // Reset opacity for enabled buttons
                button.style.cursor = 'pointer'; // Set cursor for enabled buttons
            } else {
                button.disabled = true;
                button.style.opacity = '0.5'; // Set opacity for disabled buttons
                button.style.cursor = 'not-allowed'; // Set cursor for disabled buttons
            }
        }
    }
}






