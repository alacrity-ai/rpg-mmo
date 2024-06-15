import { Node } from './node.js';

export class ActionNode extends Node {
    constructor(uniqueId, gridX, gridY, parentId = null) {
        super(uniqueId, gridX, gridY, parentId);
        this.type = 'action';
        this.actions = []; // Array to hold multiple actions
    }
}
