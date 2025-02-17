import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setWindowsBox, openDataNode } from 'store/slices/Gui';
import { generateWindows, nodesPreopen } from 'concerns/Gui';
import styles from 'GuiStyles/WindowsArea.module.scss';

export { WindowsArea };

const WindowsArea = ({ windowsOpen, mode, elmRef }: WindowsArea.Props) => {
    const dispatch = useDispatch();
    const windows = generateWindows(windowsOpen);
    const setAreaBox = () => dispatch(setWindowsBox(elmRef?.current.getBoundingClientRect()));
    const resizeObserver = new ResizeObserver(setAreaBox);
    const onRender = () => {
        setAreaBox();
        resizeObserver.observe(elmRef.current);
        nodesPreopen().forEach(nodeId => dispatch(openDataNode(nodeId)));

        return () => resizeObserver.disconnect();
    };
    const styleModule = [
        styles.WindowsArea,
        mode ? styles[mode] : ''
    ].join(' ');

    useEffect(onRender, []);

    return (
        <div ref={elmRef} className={styleModule}>
            {windows}
        </div>
    );
};
