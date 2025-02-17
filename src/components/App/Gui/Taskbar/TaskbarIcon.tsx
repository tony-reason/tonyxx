import { memo } from 'react';
import { useDispatch } from 'react-redux';
import { windowAction } from 'store/slices/Gui';
import { WindowButtonSet } from 'GuiComponents';
import { EWindowAction } from 'utils/constants';
import styles from 'GuiStyles/Taskbar/TaskbarIcon.module.scss';

export { TaskbarIcon };

const TaskbarIcon = memo(({ windowId, windowMode, action, image, focus }: Taskbar.IconProps) => {
    const dispatch = useDispatch();
    const onClick = (event: Gui.PointerEvent) => {
        event.stopPropagation();
        dispatch(windowAction({ id: windowId, action }))
    };
    const hoverActions = [EWindowAction.toggleFullscreen, EWindowAction.close];
    const styleModule = [
        styles.TaskbarIcon,
        focus ? styles.focus : ''
    ].join(' ');
    const style = {
        backgroundImage: `url(${image})`
    };

    return (
        <div className={styleModule} {...{ onClick }} {...{ style }}>
            <div className={styles.popover}>
                <WindowButtonSet windowId={windowId} windowMode={windowMode} actions={hoverActions} />
            </div>
        </div>
    );
});
