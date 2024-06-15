// startNode.js
import { Node } from './node.js';

export class StartNode extends Node {
    constructor(uniqueId, gridX, gridY, parentId = null) {
        super(uniqueId, gridX, gridY, parentId);
        this.type = 'start';
        this.start = true;
    }

    static fromJSON(json) {
        const node = new StartNode(json.uniqueId, json.gridX, json.gridY, json.parentId);
        node.start = json.start;
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
            start: this.start,
            childIds: this.childIds,
        };
    }
}