import { memo } from 'react';
import { useDispatch } from 'react-redux';
import { WindowButtonSet } from 'GuiComponents';
import { windowUiProcessor } from 'concerns/Gui';
import { windowAction, setInteractive } from 'store/slices/Gui';
import { EWindowAction } from 'utils/constants';
import styles from 'GuiStyles/Window/WindowHead.module.scss';

export { WindowHead };

const WindowHead = memo(({ windowId, windowMode, text, thumb, focus, actions }: Window.HeadProps) => {
    const dispatch = useDispatch();
    const onMouseDown = (event: Gui.PointerEvent) => {
        windowUiProcessor(windowId).callbacks.onHeadMouseDown(event);
        dispatch(setInteractive(true));
    };
    const onDoubleClick = () => {
        dispatch(windowAction({ id: windowId, action: EWindowAction.toggleFullscreen }));
    };
    const styleModule = [
        styles.WindowHead,
        focus ? styles.focus : ''
    ].join(' ');
    const thumbStyle = {
        backgroundImage: `url(${thumb})`
    };

    return (
        <div className={styleModule} {...{ onMouseDown, onDoubleClick }}>
            <div className={styles.thumb} style={thumbStyle}></div>
            <div className={styles.text}>
                <span className={styles.textLimiter}>{text}</span>
            </div>
            <WindowButtonSet windowId={windowId} windowMode={windowMode} actions={actions} />
        </div>
    );
});
