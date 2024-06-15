// choiceNode.js
import { Node } from './node.js';

export class ChoiceNode extends Node {
    constructor(uniqueId, gridX, gridY, parentId = null) {
        super(uniqueId, gridX, gridY, parentId);
        this.type = 'choice';
        this.choice = ''; // Single choice attribute
    }

    static fromJSON(json) {
        const node = new ChoiceNode(json.uniqueId, json.gridX, json.gridY, json.parentId);
        node.choice = json.choice;
        node.childIds = json.childIds || [];
        return node;
    }

    toJSON() {
        return {
            uniqueId: this.uniqueId,
            gridX: this.gridX,
            gridY: this.gridY,
            parentId: this.parentId,
            type: this.type,
            choice: this.choice,
            childIds: this.childIds,
        };
    }
}