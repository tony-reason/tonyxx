import { useEffect, useState } from 'react';
import {
    WindowButton,
    WindowResizer,
    DataNodeIcon
} from 'GuiComponents';
import { EDataNodeType } from 'utils/constants';
import * as config from 'utils/config';

export {
    processContent,
    generateButtons,
    generateResizers
};

type DataProcessor = (dataNode: DataNode, callback?: AnyFunction) => any;

const processContent: DataProcessor = (dataNode, callback) => (
    dataNode.meta.type == EDataNodeType.directory
        ? contentDirectory(dataNode)
        : contentFile(dataNode, callback)
);

const contentDirectory: DataProcessor = dataNode => {
    const iconCreator = (node: DataNode) => <DataNodeIcon
        key={node.id}
        dataNodeId={node.id}
        text={node.data.name}
        image={node.data.thumb}
        type={node.meta.type}
        containerType={EDataNodeType.directory}
    />;
    const subs = dataNode.links.childs;

    return subs && Object.values(subs).map(iconCreator);
};

const contentFile: DataProcessor = (dataNode, callback) => {
    const [content, setContent] = useState('');
    const updateUi = (text: string) => {
        setContent(text);
        callback?.(true);
    };
    const getData = () => {
        receiveContent(dataNode).then(updateUi);
    };

    useEffect(getData, [dataNode]);

    switch (dataNode.meta.type) {
        case EDataNodeType.text:
            return content;
        case EDataNodeType.html:
            return <div dangerouslySetInnerHTML={{ __html: content }}></div>;
    }
};

const receiveContent = (dataNode: DataNode) => dataNode.meta.remote
    ? fetch(dataNode.data.content).then(response => response.text())
    : Promise.resolve(dataNode.data.content);

const generateButtons = (windowId: Id, actions?: Window.Action[], windowMode?: Window.Mode) => {
    const buttonCreator = (action: Window.Action) => (
        <WindowButton
            key={action}
            windowId={windowId}
            windowMode={windowMode}
            action={action}
        />
    );

    return actions?.map(buttonCreator);
};

const generateResizers = (windowId: Id) => {
    const resizerCreator = (mode: LayoutType, index: number) => (
        <WindowResizer
            key={index}
            {...{ windowId, mode }}
        />
    );

    return config.windowResizes.map(resizerCreator);
};
