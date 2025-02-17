import { DataNode } from 'DataComponents';
export { DataSystem };

class DataSystem {
    rootNode: DataNode;
    currentNode!: DataNode;
    tree!: DataTree;
    nodes: DataNode.Collection = {};
    #rootNodeId = -1;

    constructor() {
        const rootNodeRecord = { id: this.#rootNodeId };

        this.tree = this.rootNode = this.createNode(rootNodeRecord);
        this.openNode(this.rootNode.id);
    }

    createNode(dataRecord: DataRecord) {
        const node = new DataNode(dataRecord);
        const parentNodeId = dataRecord.parentId;

        this.#registerNode(node);
        parentNodeId && this.attachNode(node.id, parentNodeId);

        return node;
    }

    deleteNode(nodeId: Id) {
        const node = this.findNode(nodeId);

        if (!node) return false;

        const siblings = node.links.parent?.links.childs;

        siblings && delete siblings[nodeId];
        this.#unregisterNode(nodeId);

        return true;
    }

    attachNode(nodeId: Id, parentId: Id) {
        const [node, parent] = [nodeId, parentId].map(this.findNode.bind(this));

        if (!(node && parent)) return false;

        node.links.parent = parent;
        (parent.links.childs ??= {})[nodeId] = node;

        return true
    }

    detachNode(nodeId: Id, parentId: Id) {
        const siblings = this.findNode(parentId)?.links.childs;

        if (!(siblings && nodeId in siblings)) return false;

        delete siblings[nodeId];
        return true;
    }

    findNode(nodeId: Id) {
        return this.nodes[nodeId];
    }

    openNode(nodeId: Id) {
        this.currentNode = this.findNode(nodeId);
    }

    #registerNode(node: DataNode) {
        this.nodes[node.id] = node;
    }

    #unregisterNode(nodeId: Id) {
        delete this.nodes[nodeId];
    }
}
