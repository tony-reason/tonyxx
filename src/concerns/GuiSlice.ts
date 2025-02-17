import { randomWindowLayout } from 'helpers/Dom';
import { isEnumField, addNodeIdToUrl } from 'helpers/var';
import {
    ELayoutType,
    EWindowAction,
    EWindowMode
} from 'utils/constants';
import * as config from 'utils/config';

export {
    findWindow,
    windowActionMode,
    processWindowAction,
    closeWindow,
    focusWindow,
    setWindowHistory,
    generateWindowRecord,
    moveWindow,
    resizeWindow,
    pickWindow,
    windowsShownIds
};

const findWindow = (state: Gui.State, id: Id) => {
    return state.windowsOpen.get(id);
};

const closeWindow = (state: Gui.State, windowId: Id) => {
    state.windowsOpen.delete(windowId);
    state.focusStask.splice(state.focusStask.indexOf(windowId), 1);
    focusWindow(state, state.focusStask.at(-1)!);
    addNodeIdToUrl(windowId, false);
};

const focusWindow = (state: Gui.State, id: Id, focusFlag = true) => {
    const windowRecord = findWindow(state, id);
    const topStackWindow = () => findWindow(state, state.focusStask.at(-1)!);

    if (!windowRecord || windowRecord.focus === focusFlag) return;

    const currentFocus = topStackWindow();
    const windowIndex = state.focusStask.indexOf(id);

    currentFocus && (currentFocus.focus = false);
    ~windowIndex && state.focusStask.splice(windowIndex, 1);
    state.focusStask[focusFlag ? 'push' : 'unshift'](id);

    const windowToFocus = topStackWindow();

    windowToFocus!.mode !== EWindowMode.collapse && (windowToFocus!.focus = true);
    state.focusStask.forEach((id, index) => findWindow(state, id)!.order = index);
};

const processWindowAction = (state: Gui.State, id: Id, windowAction: Window.Action) => {
    const windowRecord = findWindow(state, id);

    if (!windowRecord || windowAction === EWindowAction.none) return;

    if (windowAction === EWindowAction.close) {
        state.windowsOpen.delete(id);
        return;
    }

    const windowHistory = state.windowsHistory.get(id)!;
    const previousStep = {
        mode: windowHistory.previous.mode,
        layout: windowHistory.previous.layout
    };
    const currentStep = {
        mode: windowRecord.mode,
        layout: windowRecord.layout
    };

    setWindowHistory(state, id, 'previous', previousStep);
    setWindowHistory(state, id, 'current', currentStep);

    const nextStep = {
        mode: windowActionMode(windowAction, windowHistory),
        layout: windowActionLayout(windowAction, windowHistory)
    };

    setWindowHistory(state, id, 'next', nextStep);
    setWindowRecord(state, id, nextStep as Window.Record);
    focusWindow(state, id, nextStep.mode !== EWindowMode.collapse);
    setWindowHistory(state, id, 'previous', currentStep);
    setWindowHistory(state, id, 'current', nextStep);
    setWindowHistory(state, id, 'next', {});

    if (windowRecord.mode === EWindowMode.float) {
        persistWindowOpts(windowRecord);
    }
};

const persistedEntries = (storageKey: string) => {
    const storedRecords = localStorage.getItem(storageKey);
    const storedEntries = storedRecords ? JSON.parse(storedRecords) : null;

    return  new Map(storedEntries);
};

const persistWindowOpts = (windowRecord: Window.Record) => {
    const layoutMap = persistedEntries(config.storageKey.windowLayout);
    const storageRecord = {
        mode: windowRecord.mode,
        layout: windowRecord.layout
    };

    layoutMap.set(windowRecord.id, storageRecord);
    localStorage.setItem(config.storageKey.windowLayout, JSON.stringify([...layoutMap.entries()]));
};

const persistedWindowOpts = (id: Id) => {
    const layoutMap = persistedEntries(config.storageKey.windowLayout);
    return layoutMap.get(id) as Window.HistoryRecord;
};

const setWindowHistory = (state: Gui.State, id: Id, step: HistoryStep, record: Window.HistoryRecord) => {
    state.windowsHistory!.get(id)![step] = record;
};

const setWindowRecord = (state: Gui.State, idOrRecord: Id | Window.Record, record: Window.Record) => {
    const windowRecord = isWindowRecord(idOrRecord)
        ? idOrRecord
        : findWindow(state, idOrRecord);

    windowRecord && Object.assign(windowRecord, record);
};

const generateWindowRecord = (state: Gui.State, dataNodeId: Id): Window.Record => {
    const id = dataNodeId;
    const storedOpts = state.windowsHistory.get(id)?.current ?? persistedWindowOpts(id);
    const order = [...state.windowsOpen.keys()].length;

    return {
        id,
        dataNodeId,
        mode: storedOpts?.mode ?? EWindowMode.float,
        layout: storedOpts?.layout ?? randomWindowLayout(state.windowsBox),
        order,
        focus: false,
        modify: null,
        actions: config.defaultWindowActions
    };
};

const moveWindow = (state: Gui.State, windowRecord: Window.Record, direction: DirectionProp, offset: Coords) => {
    const targetPosition = windowRecord.layout[direction] + offset[coordProp[direction]];
    const justMove = isEnumField(ELayoutType, windowRecord.modify, 'coords');
    const startsInBox = targetPosition >= 0;
    const moveAllowed = justMove || startsInBox;

    if (moveAllowed) {
        windowRecord.layout[direction] = targetPosition;
    } else {
        windowRecord.modify = null;
        state.interactive = false;
    };
};

const resizeWindow = (state: Gui.State, windowRecord: Window.Record, size: SizeProp, offset: Coords) => {
    const coord = coordProp[size];
    const targetSize = windowRecord.layout[size] + offset[coord];
    const resizeAllowed = targetSize >= config.guiConfig.window.min[size] || offset[coord] > 0;

    if (resizeAllowed) {
        windowRecord.layout[size] = targetSize;
    } else {
        const shiftMode = isEnumField(ELayoutType, windowRecord.modify, 'sizeE', 'sizeS', 'size');
        shiftMode && moveWindow(state, windowRecord, positionProp[size], offset);
    }
};

const pickWindow = (windowRecord: Window.Record, event: Gui.PointerEvent) => {
    windowRecord.mode = EWindowMode.float;
    windowRecord.layout.top = 0;
    windowRecord.layout.left = event.clientX - windowRecord.layout.width / 2;
};

const windowActionMode = (windowAction: Window.Action, windowHistory: Window.History) => {
    const windowState = {
        [EWindowAction.collapse]: EWindowMode.collapse,
        [EWindowAction.fullscreen]: EWindowMode.fullscreen,
        [EWindowAction.left]: EWindowMode.left,
        [EWindowAction.right]: EWindowMode.right,
        [EWindowAction.toggleFullscreen]: windowHistory.current.mode === EWindowMode.float
            ? EWindowMode.fullscreen
            : EWindowMode.float,
        [EWindowAction.close]: EWindowMode.close,
        [EWindowAction.restore]: windowHistory.previous.mode,
        [EWindowAction.focus]: windowHistory.current.mode,
        [EWindowAction.storeLayout]: windowHistory.current.mode === EWindowMode.collapse
            ? EWindowMode.float
            : windowHistory.current.mode,
        [EWindowAction.none]: EWindowMode.float
    };

    return windowState[windowAction] ?? windowHistory.current.mode!;
};

const windowActionLayout = (windowAction: Window.Action, windowHistory: Window.History) => {
    switch (windowAction) {
        case EWindowAction.fullscreen:
        case EWindowAction.left:
        case EWindowAction.right:
        case EWindowAction.collapse:
            return windowHistory.previous.layout;
        default:
            return windowHistory.current.layout;
    }
};

const windowsShownIds = (state: Gui.State): Id[] => {
    const reducer = (ids: Id[], [id, record]: [Id, Window.Record]) => {
        record.mode !== EWindowMode.collapse && ids.push(id);
        return ids;
    };

    return [...state.windowsOpen.entries()].reduce(reducer, []);
};

const coordProp = {
    width: 'x',
    height: 'y',
    left: 'x',
    top: 'y'
} as TObject<keyof Coords>;

const positionProp = {
    width: 'left',
    height: 'top'
} as TObject<DirectionProp>;

const isWindowRecord = (value: Id | Window.Record): value is Window.Record => {
    return typeof value === 'object'
        && 'id' in value
        && 'dataNodeId' in value
        && 'mode' in value
        && 'layout' in value;
};
