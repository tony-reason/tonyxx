import { NavigatorItem } from 'GuiComponents';
export { generateSubs };

const generateSubs = (dataNode: DataNode, level: number = 0) => {
    const childs = dataNode.links?.childs;

    if (!childs) return;

    const itemCreator = (node: DataNode) => <NavigatorItem
        key={node.id}
        dataNode={node}
        level={level}
    />;

    return Object.values(childs).map(itemCreator);
};
