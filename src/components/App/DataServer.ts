import { DataSystem } from 'DataComponents';
export { DataServer };

class DataServer {
    static dataSystem: DataSystem;

    static initialize(dataRecords: DataRecord[]) {
        const nodeCreator = (record: DataRecord) => {
            const node = this.dataSystem.createNode(record);
            record.parentId || this.dataSystem.attachNode(node.id, this.dataSystem.rootNode.id);
        };

        this.dataSystem = new DataSystem();
        dataRecords.forEach(nodeCreator);

        return this.dataSystem;
    }

    static getNode(id: Id) {
        return this.dataSystem.nodes[id];
    }
}
