import { Node } from './node.js';

export class StartNode extends Node {
    constructor(uniqueId, gridX, gridY, parentId = null) {
        super(uniqueId, gridX, gridY, parentId);
        this.type = 'start';
        this.start = true;
    }
}
