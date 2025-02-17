type DataNode = import('DataSystem/DataSystem').DataNode;
type DataSystem = import('DataSystem/DataSystem').DataSystem;

interface DataRecord {
    id: Id,
    type?: DataNode.Type,
    remote?: boolean,
    parentId?: Id,
    name?: string,
    thumb?: string,
    content?: any
}

interface DataTree extends DataNode { }

namespace DataNode {
    type Type = import('utils/constants').EDataNodeType;

    interface Data {
        name?: string,
        thumb?: string,
        content?: any
    }

    interface Meta {
        type?: DataNode.Type,
        remote?: boolean,
        [key:string]: any
    }

    interface Links {
        parent?: DataNode,
        childs?: DataNode.Collection
    }

    interface Collection {
        [id: Id]: DataNode
    }
}
