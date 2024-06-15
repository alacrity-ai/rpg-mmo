import { Node } from './node.js';

export class ChoiceNode extends Node {
    constructor(uniqueId, gridX, gridY, parentId = null) {
        super(uniqueId, gridX, gridY, parentId);
        this.type = 'choice';
        this.choice = ''; // Single choice attribute
    }
}
