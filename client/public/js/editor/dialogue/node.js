export class Node {
    constructor(uniqueId, gridX, gridY, parentId = null) {
        this.uniqueId = uniqueId;
        this.gridX = gridX;
        this.gridY = gridY;
        this.parentId = parentId;
        this.children = [];
        this.childIds = [];
    }

    addChild(node) {
        this.children.push(node);
        this.childIds.push(node.uniqueId);
    }
}
