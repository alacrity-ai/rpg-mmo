export function connectionAllowed(selectedNode, NodeClass) {
    if (!selectedNode) return false;

    const selectedNodeType = selectedNode.constructor.name.toLowerCase();
    const newNodeType = NodeClass.name.toLowerCase();

    const hasConditionChild = selectedNode.children.some(child => child.constructor.name.toLowerCase() === 'conditionnode');
    const hasNonConditionChild = selectedNode.children.some(child => child.constructor.name.toLowerCase() !== 'conditionnode');
    const hasChoiceChild = selectedNode.children.some(child => child.constructor.name.toLowerCase() === 'choicenode');
    const hasNonChoiceChild = selectedNode.children.some(child => child.constructor.name.toLowerCase() !== 'choicenode');
    const hasTextOrActionChild = selectedNode.children.some(child => ['textnode', 'actionnode'].includes(child.constructor.name.toLowerCase()));

    switch (selectedNodeType) {
        case 'startnode':
            return selectedNode.children.length === 0 && connectionRules.startnode.includes(newNodeType);
        case 'choicenode':
            return (!hasNonConditionChild && (hasConditionChild ? newNodeType === 'conditionnode' : connectionRules.choicenode.includes(newNodeType)));
        case 'textnode':
            if (hasChoiceChild) return newNodeType === 'choicenode';
            if (hasConditionChild) return newNodeType === 'conditionnode';
            if (selectedNode.children.length === 0) return connectionRules.textnode.includes(newNodeType);
            return false;
        case 'actionnode':
            return (!hasNonConditionChild && (hasConditionChild ? newNodeType === 'conditionnode' : connectionRules.actionnode.includes(newNodeType)));
        case 'conditionnode':
            return !hasTextOrActionChild && ['textnode', 'actionnode'].includes(newNodeType);
        default:
            return false;
    }
}

export function generateUniqueId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

export const connectionRules = {
    start: ['textnode', 'actionnode', 'conditionnode'],
    startnode: ['textnode', 'actionnode', 'conditionnode'],
    textnode: ['textnode', 'choicenode', 'actionnode', 'conditionnode'],
    choicenode: ['actionnode', 'conditionnode', 'textnode'],
    actionnode: ['actionnode', 'conditionnode', 'textnode'],
    conditionnode: ['actionnode', 'textnode']
};

export function removeNodeButtons(dialogueEditorDiv) {
    const existingButtons = dialogueEditorDiv.querySelectorAll('.node-button');
    existingButtons.forEach(button => button.remove());
}

export function addNodeButtons(node, nodeElement, dialogueEditorDiv) {
    const pencilButton = document.createElement('button');
    pencilButton.className = 'node-button pencil-button';
    pencilButton.textContent = '✏️';
    pencilButton.style.left = `${nodeElement.offsetLeft + nodeElement.offsetWidth - 5}px`;
    pencilButton.style.top = `${nodeElement.offsetTop + 30}px`;

    pencilButton.addEventListener('click', (event) => {
        event.stopPropagation();
        const dialogueEditor = document.getElementById('dialogue-editor-container').dialogueEditorInstance;
        if (dialogueEditor) {
            if (node.type === 'text') {
                dialogueEditor.createTextEditorPopup(node);
            } else if (node.type === 'choice') {
                dialogueEditor.createChoiceEditorPopup(node);
            } else if (node.type === 'action') {
                dialogueEditor.createActionEditorPopup(node);
            } else if (node.type === 'condition') {
                dialogueEditor.createConditionEditorPopup(node);
            }
        }
    });

    const trashButton = document.createElement('button');
    trashButton.className = 'node-button trash-button';
    trashButton.textContent = '🗑️';
    trashButton.style.left = `${nodeElement.offsetLeft + nodeElement.offsetWidth + 20}px`;
    trashButton.style.top = `${nodeElement.offsetTop + 30}px`;

    trashButton.addEventListener('click', (event) => {
        event.stopPropagation();
        try {
            const dialogueEditor = document.getElementById('dialogue-editor-container').dialogueEditorInstance;
            if (dialogueEditor) {
                dialogueEditor.selectNode(node, nodeElement);
                dialogueEditor.deleteNode();
            } else {
                console.error('dialogueEditorInstance is not defined');
            }
        } catch (error) {
            console.error('Error deleting node:', error);
        }
    });

    dialogueEditorDiv.querySelector('.content').appendChild(pencilButton);
    dialogueEditorDiv.querySelector('.content').appendChild(trashButton);
}


export function isGridOccupied(gridX, gridY, nodes) {
    // Check if any node occupies the given gridX and gridY
    return nodes.some(node => node.gridX === gridX && node.gridY === gridY);
}

export function isPotentialLowerCollision(gridX, gridY, siblingCount, nodes, selectedNode) {
    if (siblingCount === 0) return false;

    const maxGridY = Math.max(...nodes.map(node => node.gridY)) + 2;

    for (let y = 1; y <= maxGridY; y++) {
        if (nodes.some(node => node.gridX === gridX && (node.gridY + y) === gridY && node.parentId !== selectedNode.uniqueId)) {
            return true;
        }
    }
    return false;
}

export function isPotentialUpperCollision(gridX, gridY, nodes, selectedNode) {
    const maxGridY = Math.max(...nodes.map(node => node.gridY)) + 2;

    for (let y = maxGridY; y >= 0; y--) {
        if (nodes.some(node => node.gridX === gridX && (node.gridY - y) === gridY && node.parentId !== selectedNode.uniqueId)) {
            return true;
        }
    }
    return false;
}

export function shiftColumnsRight(startGridX, nodes) {
    // Shift all nodes in the given column and to the right of it by one unit on the X-axis
    nodes.forEach(node => {
        if (node.gridX >= startGridX) {
            node.gridX += 1;
        }
    });
}

export function collectNodesToDelete(nodeId, nodes) {
    const nodesToDelete = [];
    const queue = [nodeId];

    while (queue.length > 0) {
        const currentId = queue.shift();
        nodesToDelete.push(currentId);
        
        // Find all children of the current node
        nodes.forEach(node => {
            if (node.parentId === currentId) {
                queue.push(node.uniqueId);
            }
        });
    }

    return nodesToDelete;
}

export const nodeTypeToEmoji = {
    start: '🚀', // Start node
    text: '💬', // Text node
    choice: '🔀', // Choice node
    condition: '❓', // Condition node
    action: '⚡', // Action node
};