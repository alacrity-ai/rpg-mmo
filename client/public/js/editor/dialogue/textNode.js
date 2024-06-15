// textNode.js
import { Node } from './node.js';

export class TextNode extends Node {
    constructor(uniqueId, gridX, gridY, parentId = null) {
        super(uniqueId, gridX, gridY, parentId);
        this.type = 'text';
        this.content = '';
    }

    static fromJSON(json) {
        const node = new TextNode(json.uniqueId, json.gridX, json.gridY, json.parentId);
        node.content = json.content;
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
            content: this.content,
            childIds: this.childIds,
        };
    }
}