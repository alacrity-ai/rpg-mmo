import { Node } from './node.js';

export class ConditionNode extends Node {
    constructor(uniqueId, gridX, gridY, parentId = null) {
        super(uniqueId, gridX, gridY, parentId);
        this.type = 'condition';
        this.conditions = [];
    }
}
