import { DataNodeIcon } from 'GuiComponents';
import { empty } from 'helpers/var';

export { generateIcons };

const generateIcons = (nodesHash: DataNode.Collection, desktopNodesIds: Id[]) => {
    if (empty(nodesHash) || empty(desktopNodesIds)) return;

    const iconCreator = (nodeId: Id) => {
        const node = nodesHash[nodeId];

        return <DataNodeIcon
            key={node.id}
            dataNodeId={node.id}
            text={node.data.name}
            image={node.data.thumb}
            type={node.meta.type}
        />;
    };

    return desktopNodesIds.map(iconCreator);
};
