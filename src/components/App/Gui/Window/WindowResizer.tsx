import { memo } from 'react';
import { useDispatch } from 'react-redux';
import { setInteractive } from 'store/slices/Gui';
import { windowUiProcessor } from 'concerns/Gui';
import { ELayoutType } from 'utils/constants';
import styles from 'GuiStyles/Window/WindowResizer.module.scss';

export { WindowResizer };

const WindowResizer = memo(({ windowId, mode = ELayoutType.size }: Window.ResizerProps) => {
    const dispatch = useDispatch();
    const onMouseDown = (event: Gui.PointerEvent) => {
        windowUiProcessor(windowId).callbacks.onResizerMouseDown(event, mode);
        dispatch(setInteractive(true));
    };
    const styleModule = [
        styles.WindowResizer,
        styles[mode]
    ].join(' ');

    return <div className={styleModule} {...{ onMouseDown }}></div>;
});
