import { Window } from 'GuiComponents';
import { setCssVar } from 'helpers/Dom';
import {
    ELayoutType,
    EMouseButton,
    EWindowMode
} from 'utils/constants';
import * as config from 'utils/config';

export {
    generateWindows,
    windowUiProcessor,
    pointerMoveProcessor,
    releaseWindowUi,
    initializeGui,
    nodesPreopen
};

interface PointerHandlers {
    [eventName: string]: Gui.PointerHandler
}

interface WindowUiRegistryRecord {
    uiMode: LayoutType | null,
    offset: Coords,
    callbacks: PointerHandlers,
    prevEventCoords: Coords
}

type WindowUiRegistry = Map<Id, WindowUiRegistryRecord>;

const windowUiRegistry: WindowUiRegistry = new Map;
const uiRegistry = {
    uiActiveWindow: null as number | null,
    windowRegistry: windowUiRegistry
};

const generateWindows = (windowsOpen: Window.Collection) => {
    const windowCreator = (windowRecord: Window.Record) => (
        <Window
            key={windowRecord.id}
            {...windowRecord}
        />
    );

    return [...windowsOpen.values()].map(windowCreator);
};

const windowUiProcessor = (windowId: Id, callbacks: PointerHandlers = {}) => {
    let windowUiRecord: WindowUiRegistryRecord;

    const setUiReady = (layoutType: LayoutType) => {
        windowUiRecord.uiMode = layoutType;
        uiRegistry.uiActiveWindow = windowId;
    };

    const setStartCoords: Gui.PointerHandler = event => {
        ({
            clientX: windowUiRecord.prevEventCoords.x,
            clientY: windowUiRecord.prevEventCoords.y
        } = event);
    };

    const calcOffset: Gui.PointerHandler = event => {
        windowUiRecord.offset.x = event.clientX - windowUiRecord.prevEventCoords.x;
        windowUiRecord.offset.y = event.clientY - windowUiRecord.prevEventCoords.y;
        setStartCoords(event);

        return windowUiRecord.offset;
    };

    const setLayoutModify = (event: Gui.PointerEvent, layoutType: LayoutType) => {
        if (event.button !== EMouseButton.main) return;

        setUiReady(layoutType);
        setStartCoords(event);
    };

    const handlers: PointerHandlers = {
        onHeadMouseDown: event => setLayoutModify(event, ELayoutType.coords),
        onResizerMouseDown: (event: Gui.PointerEvent, resizeMode: LayoutType) => setLayoutModify(event, resizeMode),
        onMouseMove: calcOffset
    };

    const processCallback = (handler: Gui.PointerHandler, event: Gui.PointerEvent, payload: any, callback?: AnyFunction) => {
        const result = handler(event, payload);

        callback?.(result);
        return result;
    };

    const extendHandlers = (handlers: PointerHandlers, callbacks: PointerHandlers) => {
        return Object.entries(handlers).reduce(
            (handlersDict, [eventName, handler]) => Object.assign(
                handlersDict,
                {
                    [eventName]: (event, payload) => processCallback(handler, event, payload, callbacks[eventName])
                } as PointerHandlers
            ),
            {}
        );
    };

    const setupUiRecord = () => {
        const uiRecord = windowUiRegistry.get(windowId);

        if (uiRecord) {
            uiRecord.callbacks = extendHandlers(uiRecord.callbacks, callbacks);
            return uiRecord;
        };

        const newUiRecord = {
            uiMode: null,
            prevEventCoords: {} as Coords,
            offset: { x: 0, y: 0 },
            callbacks: extendHandlers(handlers, callbacks)
        };

        windowUiRegistry.set(windowId, newUiRecord);
        windowUiRecord = newUiRecord;

        return windowUiRecord;
    };

    return setupUiRecord();
};

const pointerMoveProcessor = (event: Gui.PointerEvent, callback: AnyFunction, windowsBox?: DOMRect) => {
    const activeWindowId = uiRegistry.uiActiveWindow;

    if (activeWindowId == null) return EWindowMode.none;

    const windowUiRecord = uiRegistry.windowRegistry.get(activeWindowId);
    const layoutModifyType = windowUiRecord?.uiMode;
    const windowProcessor = windowUiProcessor(activeWindowId);

    windowProcessor.callbacks.onMouseMove?.(event);
    callback(activeWindowId, windowProcessor.offset, layoutModifyType, event);

    if (!(windowsBox && layoutModifyType == ELayoutType.coords)) {
        return EWindowMode.none;
    }

    const bound = config.guiConfig.windowsBox.bound;

    if (event.clientY - windowsBox.top <= bound) {
        return EWindowMode.fullscreen;
    }

    if (event.clientX - windowsBox.left <= bound) {
        return EWindowMode.left;
    }

    if (windowsBox.right - event.clientX <= bound) {
        return EWindowMode.right;
    }

    if (windowsBox.bottom - event.clientY <= bound) {
        return EWindowMode.collapse;
    }

    return EWindowMode.none;
};

const releaseWindowUi = (callback?: AnyFunction) => {
    const activeWindowId = uiRegistry.uiActiveWindow;

    if (activeWindowId == null) return;

    uiRegistry.windowRegistry.get(activeWindowId)!.uiMode = null;
    uiRegistry.uiActiveWindow = null;
    callback?.(activeWindowId);
};

const initializeGui = () => {
    const cssVarsProps = {
        width: '--windowMinWidth',
        height: '--windowMinHeight'
    } as TObject<string>;

    Object.entries(config.guiConfig.window.min)
        .forEach(([key, value]) => setCssVar(cssVarsProps[key], `${value}px`));
};

const nodesPreopen = () => {
    const url = new URL(document.location.toString());
    const idList = [...url.searchParams.getAll(config.url.search.node)];

    return idList.map(idString => parseInt(idString));
};
