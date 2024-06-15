// conditionNode.js
import { Node } from './node.js';

export class ConditionNode extends Node {
    constructor(uniqueId, gridX, gridY, parentId = null) {
        super(uniqueId, gridX, gridY, parentId);
        this.type = 'condition';
        this.conditions = [];
    }

    static fromJSON(json) {
        const node = new ConditionNode(json.uniqueId, json.gridX, json.gridY, json.parentId);
        node.conditions = json.conditions;
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
            conditions: this.conditions,
            childIds: this.childIds,
        };
    }
}