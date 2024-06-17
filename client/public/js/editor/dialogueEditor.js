// dialogueEditor.js

import { createDialogueEditorToolbar, updateDialogueEditorToolbar } from './utils/dialogueEditorToolbar.js';
import { nodeTypeToEmoji, connectionAllowed, addNodeButtons, removeNodeButtons, generateUniqueId, collectNodesToDelete, isGridOccupied, isPotentialLowerCollision, isPotentialUpperCollision, shiftColumnsRight } from './dialogue/nodeUtils.js';
import { createDialogueTextEditorPopup } from './popups/dialogueTextEditor.js';
import { createDialogueChoiceEditorPopup } from './popups/dialogueChoiceEditor.js';
import { createDialogueActionEditorPopup } from './popups/dialogueActionEditor.js';
import { createDialogueConditionEditorPopup } from './popups/dialogueConditionEditor.js';
import { TextNode } from './dialogue/textNode.js';
import { ChoiceNode } from './dialogue/choiceNode.js';
import { ConditionNode } from './dialogue/conditionNode.js';
import { ActionNode } from './dialogue/actionNode.js';
import { StartNode } from './dialogue/startNode.js';
import { drawLine } from './utils/drawLine.js';

export class DialogueEditor {
    constructor(zoneEditor, childXSpacing = 50, childYSpacing = 50) {
        this.zoneEditor = zoneEditor;
        this.zoneData = null;
        this.sceneId = null;
        this.dialogueEditorDiv = document.getElementById('dialogue-editor-container'); // Reference existing div
        this.dialogueEditorDiv.dialogueEditorInstance = this;
        this.mainToolbar = document.getElementById('toolbar');
        this.nodes = [];
        this.selectedNode = null;
        this.childXSpacing = childXSpacing;
        this.childYSpacing = childYSpacing;

        // Add the toolbar
        this.toolbarContainer = document.getElementById('dialogue-toolbar-container');
        const toolbar = createDialogueEditorToolbar(
            () => this.hide(),
            () => this.createChildNode(TextNode),
            () => this.createChildNode(ChoiceNode),
            () => this.createChildNode(ActionNode),
            () => this.createChildNode(ConditionNode),
            () => this.saveDialogue(), // Add save button to the toolbar
            (event) => this.handleFileLoad(event), // Add load button to the toolbar
            () => this.reset() // Add reset button to the toolbar
        );
        this.toolbarContainer.appendChild(toolbar);

        // Add the start node
        this.addStartNode();

        // Create the hover popup element
        this.hoverPopup = document.createElement('div');
        this.hoverPopup.className = 'node-hover-popup';
        document.body.appendChild(this.hoverPopup);
    }

    show(sceneId, zoneData) {
        this.zoneData = zoneData;
        this.sceneId = sceneId;
        this.dialogueEditorDiv.style.display = 'block';
        this.toolbarContainer.style.display = 'flex'; // Ensure the toolbar is visible
        this.mainToolbar.style.display = 'none'; // Hide the main toolbar when showing the dialogue editor
    }

    hide() {
        this.mainToolbar.style.display = 'flex'; // Show the main toolbar when hiding the dialogue editor
        this.dialogueEditorDiv.style.display = 'none';
        this.toolbarContainer.style.display = 'none'; // Hide the toolbar when hiding the dialogue editor
        this.zoneEditor.toggleSceneEditor(this.sceneId, this.zoneData);
    }

    addStartNode() {
        const startNode = new StartNode(generateUniqueId(), 0, 0);
        this.nodes.push(startNode);
        this.renderNode(startNode);
        this.selectNode(startNode, document.querySelector('.dialogue-node'));
    }

    createChildNode(NodeClass) {
        if (!this.selectedNode) return;
        if (!connectionAllowed(this.selectedNode, NodeClass)) return;

        let newChildGridX = 0;

        const gridX = this.selectedNode.gridX;
        const gridY = this.selectedNode.gridY + 1;
        const siblingCount = this.selectedNode.children.length;
        newChildGridX = gridX + siblingCount;

        // Pre-emptively check for potential grid collision from below
        if (isGridOccupied(newChildGridX, gridY, this.nodes) || isPotentialLowerCollision(newChildGridX, gridY, siblingCount, this.nodes, this.selectedNode)) {
            shiftColumnsRight(newChildGridX, this.nodes);
        }

        // Pre-emptively check for potential grid collision from above
        if (isPotentialUpperCollision(newChildGridX, gridY, this.nodes, this.selectedNode)) {
            newChildGridX = Math.max(...this.nodes.map(node => node.gridX)) + 1;
        }

        const newChild = new NodeClass(generateUniqueId(), newChildGridX, gridY, this.selectedNode.uniqueId);
        this.selectedNode.addChild(newChild);
        this.nodes.push(newChild);
        this.renderTree(); // Re-render the entire tree after updating positions
    }

    renderNode(node) {
        const x = node.gridX * this.childXSpacing;
        const y = node.gridY * this.childYSpacing;

        node.x = x;
        node.y = y;

        const nodeElement = document.createElement('div');
        nodeElement.className = `dialogue-node ${node.type}`;
        nodeElement.textContent = nodeTypeToEmoji[node.type] || '❔'; // Use emoji or default to question mark
        nodeElement.style.left = `${x}px`;
        nodeElement.style.top = `${y}px`;
        nodeElement.style.zIndex = 1;

        nodeElement.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent event from bubbling up
            this.selectNode(node, nodeElement);
        });

        nodeElement.addEventListener('mouseenter', () => {
            this.showHoverPopup(node, nodeElement);
        });

        nodeElement.addEventListener('mouseleave', () => {
            this.hideHoverPopup();
        });

        this.dialogueEditorDiv.querySelector('.content').appendChild(nodeElement);

        // Get this node's parent by node.parentId
        const parent = this.nodes.find(n => n.uniqueId === node.parentId);
        // Draw a line to the parent node
        if (parent) {
            drawLine(x + nodeElement.offsetWidth / 2, y + nodeElement.offsetHeight / 2, parent.x + nodeElement.offsetWidth / 2, parent.y + nodeElement.offsetHeight / 2, this.dialogueEditorDiv.querySelector('.content'));
        }
    }

    renderTree() {
        // Clear existing nodes
        this.dialogueEditorDiv.querySelector('.content').innerHTML = '';

        // Render all nodes based on updated positions
        this.nodes.forEach(node => this.renderNode(node));

        // Reselect the selected node
        if (this.selectedNode) {
            // Get the selectedNode element by matching the uniqueId
            const selectedNodeElement = Array.from(this.dialogueEditorDiv.querySelectorAll('.dialogue-node')).find(element => {
                const nodeType = element.classList.contains(this.selectedNode.type);
                const nodePosition = element.style.left === `${this.selectedNode.x}px` && element.style.top === `${this.selectedNode.y}px`;
                return nodeType && nodePosition;
            });

            this.selectNode(this.selectedNode, selectedNodeElement);
        }
    }

    selectNode(node, nodeElement) {
        if (this.selectedNodeElement) {
            this.selectedNodeElement.classList.remove('selected');
            removeNodeButtons(this.dialogueEditorDiv);
        }

        this.selectedNode = node;
        this.selectedNodeElement = nodeElement;
        this.selectedNodeElement.classList.add('selected');
        updateDialogueEditorToolbar(node);

        if (this.selectedNode.type != 'start') {
            addNodeButtons(node, nodeElement, this.dialogueEditorDiv);
        }
        console.log('Selected node children:', JSON.stringify(this.selectedNode))
    }

    deleteNode() {
        if (!this.selectedNode || this.selectedNode.type === 'start') return; // Do not delete if no node is selected or if it's the start node

        const nodeIdToDelete = this.selectedNode.uniqueId;

        // Find the parent node
        const parentNode = this.nodes.find(node => node.children.some(child => child.uniqueId === nodeIdToDelete));

        // If a parent node is found, remove the child from its children and childIds arrays
        if (parentNode) {
            parentNode.children = parentNode.children.filter(child => child.uniqueId !== nodeIdToDelete);
            parentNode.childIds = parentNode.childIds.filter(childId => childId !== nodeIdToDelete);
        }

        // Collect all nodes to delete
        const nodesToDelete = collectNodesToDelete(nodeIdToDelete, this.nodes);

        // Remove nodes from this.nodes
        this.nodes = this.nodes.filter(node => !nodesToDelete.includes(node.uniqueId));

        // Clear selection
        this.selectedNode = null;
        this.selectedNodeElement = null;

        // Re-render the tree
        this.renderTree();
    }

    reset() {
        const confirmed = confirm('Are you sure you want to reset the dialogue tree? This action cannot be undone.');
        if (!confirmed) return;
        
        this.nodes = [];
        this.addStartNode(); // Re-add the start node
        this.renderTree();
    }    

    createTextEditorPopup(node) {
        createDialogueTextEditorPopup(
            node, // Pass the node to the popup function
            ({ content, wavPath }) => { // Destructure to get content and wavPath
                node.content = content;
                node.wavPath = wavPath; // Save the wavPath
                console.log('Updated node content:', node.content);
                console.log('Updated node wavPath:', node.wavPath);
                this.renderTree(); // Re-render to update node display if necessary
            },
            () => {
                console.log('Text editor popup canceled');
            }
        );
    }

    createChoiceEditorPopup(node) {
        createDialogueChoiceEditorPopup(
            node, // Pass the node to the popup function
            (choice) => {
                node.choice = choice;
                console.log('Updated node choice:', node.choice);
                this.renderTree(); // Re-render to update node display if necessary
            },
            () => {
                console.log('Choice editor popup canceled');
            }
        );
    }

    createActionEditorPopup(node) {
        createDialogueActionEditorPopup(
            node, // Pass the node to the popup function
            (actions) => {
                node.actions = actions;
                console.log('Updated node actions:', node.actions);
                this.renderTree(); // Re-render to update node display if necessary
            },
            () => {
                console.log('Action editor popup canceled');
            }
        );
    }

    createConditionEditorPopup(node) {
        createDialogueConditionEditorPopup(
            node, // Pass the node to the popup function
            (conditions) => {
                node.conditions = conditions;
                console.log('Updated node conditions:', node.conditions);
                this.renderTree(); // Re-render to update node display if necessary
            },
            () => {
                console.log('Condition editor popup canceled');
            }
        );
    }

    showHoverPopup(node, nodeElement) {
        let content = '';
    
        switch (node.type) {
            case 'text':
                content = node.content || 'No content';
                if (node.wavPath) {
                    content += `\nWAV: ${node.wavPath}`;
                }
                this.hoverPopup.style.backgroundColor = '#007bff'; // Blue
                break;            
            case 'choice':
                content = node.choice || 'No choice';
                this.hoverPopup.style.backgroundColor = '#28a745'; // Green
                break;
            case 'action':
                content = node.actions.map(action => `${Object.keys(action)[0]}: ${Object.values(action)[0]}`).join('\n') || 'No actions';
                this.hoverPopup.style.backgroundColor = '#6f42c1'; // Purple
                break;
            case 'condition':
                content = node.conditions.map(condition => `${Object.keys(condition)[0]}: ${Object.values(condition)[0]}`).join('\n') || 'No conditions';
                this.hoverPopup.style.backgroundColor = '#fd7e14'; // Orange
                break;
            default:
                content = 'Starting Node';
                this.hoverPopup.style.backgroundColor = '#000000'; // Black
                break;
        }
    
        this.hoverPopup.textContent = content;
        this.hoverPopup.style.display = 'block';
        this.hoverPopup.style.left = `${nodeElement.offsetLeft + nodeElement.offsetWidth}px`;
        this.hoverPopup.style.top = `${nodeElement.offsetTop}px`;
    }
    
    hideHoverPopup() {
        this.hoverPopup.style.display = 'none';
    }
    

    saveDialogue() {
        const dialogueData = this.nodes.map(node => node.toJSON());
        const blob = new Blob([JSON.stringify(dialogueData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'dialogue.json';
        a.click();

        URL.revokeObjectURL(url); // Clean up the URL object
    }

    handleFileLoad(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const jsonData = JSON.parse(e.target.result);
            this.loadDialogue(jsonData);
        };
        reader.readAsText(file);
    }

    loadDialogue(jsonData) {
        this.nodes = jsonData.map(json => {
            switch (json.type) {
                case 'start':
                    return StartNode.fromJSON(json);
                case 'text':
                    return TextNode.fromJSON(json);
                case 'choice':
                    return ChoiceNode.fromJSON(json);
                case 'action':
                    return ActionNode.fromJSON(json);
                case 'condition':
                    return ConditionNode.fromJSON(json);
                default:
                    throw new Error(`Unknown node type: ${json.type}`);
            }
        });

        // Re-establish parent-child relationships
        this.nodes.forEach(node => {
            node.childIds.forEach(childId => {
                const childNode = this.nodes.find(n => n.uniqueId === childId);
                if (childNode) {
                    node.addChild(childNode);
                }
            });
        });

        // Render the entire tree
        this.renderTree();
    }
}
