import { memo } from 'react';
import { useDispatch } from 'react-redux';
import { windowAction } from 'store/slices/Gui';
import styles from 'GuiStyles/Window/WindowButton.module.scss';

export { WindowButton };

const WindowButton = memo(({ windowId, windowMode, action }: Window.ButtonProps) => {
    const dispatch = useDispatch();
    const onClick = (event: Gui.PointerEvent) => {
        event.stopPropagation();
        dispatch(windowAction({ id: windowId, action }));
    };
    const onMouseDown = (event: Gui.PointerEvent) => event.stopPropagation();
    const styleModule = [
        styles.WindowButton,
        windowMode ? styles[`windowMode_${windowMode}`] : '',
        styles[action] ?? ''
    ].join(' ');

    return <div className={styleModule} {...{ onClick, onMouseDown }}></div>;
});
