import { memo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { windowAction } from 'store/slices/Gui';
import { WindowHead, WindowContent } from 'GuiComponents';
import { processContent, generateResizers } from 'concerns/Window';
import { setCssVarMax } from 'helpers/Dom';
import { EWindowAction, EWindowMode } from 'utils/constants';
import styles from 'GuiStyles/Window.module.scss';

export { Window };

const Window = memo(({ id, dataNodeId, actions, mode, layout, order, focus, modify }: Window.Record) => {
    const dataNodes = useSelector((state: RootState) => state.dataSystem.dataNodesHash);
    const dataNode = dataNodes![dataNodeId];
    const [ready, setReady] = useState(!dataNode.meta.remote);
    const dispatch = useDispatch();
    const focusWindow = () => dispatch(windowAction({ id, action: EWindowAction.focus }));
    const resizers = generateResizers(id);
    const zIndex = (order + 1) * 10;
    const styleModule = [
        styles.Window,
        styles[mode] ?? '',
        modify ? styles[`modify_${modify}`] : '',
        focus ? styles.focus : ''
    ].join(' ');
    const style = {
        ...layout,
        zIndex
    };

    setCssVarMax('--maxWindowZIndex', zIndex);

    return (
        <div className={styleModule} onMouseDown={focusWindow} {...{ style }}>
            <WindowHead
                windowId={id}
                windowMode={mode}
                text={dataNode.data.name}
                thumb={dataNode.data.thumb}
                actions={actions}
                focus={focus}
            />
            <WindowContent
                content={processContent(dataNode, setReady)}
                type={dataNode.meta.type}
                ready={ready}
            />
            {mode === EWindowMode.float && resizers}
        </div>
    );
});
