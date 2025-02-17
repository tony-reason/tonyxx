import { useSelector } from 'react-redux';
import { TaskbarIcon } from 'GuiComponents';
import { EWindowAction, EWindowMode } from 'utils/constants';

export { generateIcons };

const generateIcons = (windowsOpen: Window.Collection) => {
    const dataNodes = useSelector((state: RootState) => state.dataSystem.dataNodesHash);
    const iconCreator = (windowRecord: Window.Record) => {
        const dataNode = dataNodes![windowRecord.dataNodeId];
        const defaultAction = windowRecord.mode === EWindowMode.collapse
            ? EWindowAction.restore
            : windowRecord.focus
                ? EWindowAction.collapse
                : EWindowAction.focus;

        return <TaskbarIcon
            key={windowRecord.id}
            windowId={windowRecord.id}
            windowMode={windowRecord.mode}
            action={defaultAction}
            image={dataNode.data.thumb}
            focus={!!windowRecord.focus}
        />;
    };

    return [...windowsOpen.values()].map(iconCreator);
};
