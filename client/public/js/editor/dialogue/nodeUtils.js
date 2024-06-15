import { ChoiceNode } from './choiceNode.js';

export function connectionAllowed(selectedNode, NodeClass) {
    if (!selectedNode) return false;

    const selectedNodeType = selectedNode.constructor.name.toLowerCase();

    // If choice node already has a child, disallow adding another child
    if (selectedNodeType === 'choicenode' && selectedNode.children.length > 0) return false;

    // If the start node already has a child, disallow adding another child
    if (selectedNodeType === 'startnode' && selectedNode.children.length > 0) return false;

    // A text node can either have one child of any node type, or multiple children choice nodes
    if (selectedNodeType === 'textnode') {
        const newNodeType = NodeClass.name.toLowerCase();
        const hasNonChoiceChild = selectedNode.children.some(child => child.constructor.name.toLowerCase() !== 'choicenode');
        const hasChoiceChild = selectedNode.children.some(child => child.constructor.name.toLowerCase() === 'choicenode');

        // If adding a choice node, allow it only if there are no non-choice children
        if (newNodeType === 'choicenode') {
            return !hasNonChoiceChild;
        }

        // If adding a non-choice node, disallow if there are any children
        if (hasChoiceChild || hasNonChoiceChild) {
            return false;
        }

        // If adding a non-choice node and no children exist yet, allow it
        return true;
    }

    // An action node can only have one child
    if (selectedNodeType === 'actionnode' && selectedNode.children.length > 0) return false;

    const newNodeType = NodeClass.name.toLowerCase();
    return connectionRules[selectedNodeType].includes(newNodeType);
}

export function generateUniqueId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

export const connectionRules = {
    start: ['textnode', 'choicenode', 'actionnode', 'conditionnode'],
    startnode: ['textnode', 'choicenode', 'actionnode', 'conditionnode'],
    textnode: ['textnode', 'choicenode', 'actionnode', 'conditionnode'],
    choicenode: ['actionnode', 'conditionnode', 'textnode'],
    actionnode: ['actionnode', 'conditionnode', 'textnode'],
    conditionnode: ['actionnode', 'conditionnode', 'textnode']
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
    pencilButton.style.top = `${nodeElement.offsetTop - 10}px`;

    pencilButton.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    const trashButton = document.createElement('button');
    trashButton.className = 'node-button trash-button';
    trashButton.textContent = '🗑️';
    trashButton.style.left = `${nodeElement.offsetLeft + nodeElement.offsetWidth + 20}px`;
    trashButton.style.top = `${nodeElement.offsetTop - 10}px`;

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