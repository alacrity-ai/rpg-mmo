import { Node } from './node.js';

export class TextNode extends Node {
    constructor(uniqueId, gridX, gridY, parentId = null) {
        super(uniqueId, gridX, gridY, parentId);
        this.type = 'text';
        this.content = '';
    }
}
