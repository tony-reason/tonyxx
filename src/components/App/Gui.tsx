import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    modifyWindowLayout,
    setWindowModify,
    windowAction,
    setInteractive,
    setGuiElm
} from 'store/slices/Gui'
import {
    pointerMoveProcessor,
    releaseWindowUi,
    initializeGui
 } from 'concerns/Gui';
import {
    Desktop,
    Taskbar,
    WindowsArea
} from 'GuiComponents';
import {
    EMouseButton,
    EWindowAction,
    EWindowMode
} from 'utils/constants';
import styles from 'styles/components/App/Gui.module.scss';

export { Gui };

const Gui = ({ data, desktopNodesIds, desktopImage }: Gui.Props) => {
    const [windowsAreaMode, setWindowsAreaMode] = useState(EWindowMode.none);
    const dispatch = useDispatch();
    const { windowsOpen, windowsBox, interactive } = useSelector((state: RootState) => state.gui);
    const windowsAreaRef = useRef<HTMLElement | null>(null);
    const guiRef = useRef<HTMLDivElement | null>(null);

    const modifyWindow = (id: Id, offset: Coords, layoutType: LayoutType, event: Gui.PointerEvent) => {
        dispatch(modifyWindowLayout({ id, offset, layoutType, event }));
    };
    const releaseWindowLayout = (id: Id) => {
        dispatch(setWindowModify({ id, layoutType: null }));
    };
    const releaseCallback = (action = EWindowAction.none) => (
        (id: Id) => {
            dispatch(windowAction({ id, action: windowsAreaMode || action }));
            releaseWindowLayout(id);
            setWindowsAreaMode(EWindowMode.none);
            dispatch(setInteractive(false));
        }
    );
    const onMouseMove = (event: Gui.PointerEvent) => {
        if (!(event.movementX || event.movementY)) return;

        if (!interactive) {
            releaseWindowUi();
            return;
        };

        const aptWindowMode = pointerMoveProcessor(event, modifyWindow, windowsBox);
        setWindowsAreaMode(aptWindowMode);
    };
    const onMouseUp = (event: Gui.PointerEvent) => {
        if (event.button !== EMouseButton.main) return;
        releaseWindowUi(releaseCallback(EWindowAction.storeLayout));
    };
    const onMouseLeave = () => releaseWindowUi(releaseCallback());
    const onRender = () => {
        initializeGui();
        dispatch(setGuiElm(guiRef.current));
    };

    useEffect(onRender, []);

    return (
        <div className={styles.Gui} {...{ onMouseMove, onMouseUp, onMouseLeave }} ref={guiRef}>
            <WindowsArea
                elmRef={windowsAreaRef}
                windowsOpen={windowsOpen}
                mode={windowsAreaMode}
            />
            <Desktop nodesIds={desktopNodesIds} image={desktopImage} />
            <Taskbar data={data} windowsOpen={windowsOpen} />
        </div>
    );
};
