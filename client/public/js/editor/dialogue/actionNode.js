// actionNode.js
import { Node } from './node.js';

export class ActionNode extends Node {
    constructor(uniqueId, gridX, gridY, parentId = null) {
        super(uniqueId, gridX, gridY, parentId);
        this.type = 'action';
        this.actions = []; // Array to hold multiple actions
    }

    static fromJSON(json) {
        const node = new ActionNode(json.uniqueId, json.gridX, json.gridY, json.parentId);
        node.actions = json.actions;
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
            actions: this.actions,
            childIds: this.childIds,
        };
    }
}