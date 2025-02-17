import { createSlice } from '@reduxjs/toolkit';
import { DataServer } from 'DataComponents';
import { invertCoords } from 'helpers/Gui';
import { addNodeIdToUrl } from 'helpers/var';
import {
    ELayoutType,
    EWindowAction,
    EWindowMode
} from 'utils/constants';
import * as gui from 'concerns/GuiSlice';

export * from 'concerns/GuiSlice';

const initialState: Gui.State = {
    windowsOpen: new Map,
    windowsHistory: new Map,
    focusStask: [],
    interactive: false,
    guiElm: null
};

const openDataNode_reducer: Gui.Reducer = (state, action) => {
    const nodeId = action.payload;

    if (!DataServer.getNode(nodeId)) return;

    const dataWindowOpened = [...state.windowsOpen.values()]
        .find(windowRecord => windowRecord.dataNodeId === nodeId);

    if (dataWindowOpened) {
        const targetState = dataWindowOpened.mode === EWindowMode.collapse
            ? EWindowAction.restore
            : EWindowAction.focus;

        gui.processWindowAction(state, dataWindowOpened.id, targetState);

        return;
    }

    const windowRecord = gui.generateWindowRecord(state, nodeId);
    const historyRecord = {
        previous: {},
        current: {
            mode: windowRecord.mode,
            layout: windowRecord.layout
        },
        next: {}
    };

    state.windowsOpen.set(windowRecord.id, windowRecord);
    state.windowsHistory.set(windowRecord.id, historyRecord);
    gui.focusWindow(state, windowRecord.id);
    gui.processWindowAction(state, windowRecord.id, EWindowAction.storeLayout);
    addNodeIdToUrl(nodeId);
};

const windowAction_reducer: Gui.Reducer = (state, action) => {
    const { id, action: windowAction } = action.payload
    const windowRecord = gui.findWindow(state, id);

    if (!windowRecord) return;

    switch (windowAction) {
        case EWindowAction.close:
            gui.closeWindow(state, id);
            break;
        case EWindowAction.focus:
            gui.focusWindow(state, id);
            break;
        default:
            gui.processWindowAction(state, id, windowAction);
    }
};

const setWindowModify_reducer: Gui.Reducer = (state, action) => {
    const { id, layoutType } = action.payload;
    const windowRecord = gui.findWindow(state, id);

    windowRecord && (windowRecord.modify = layoutType);
};

const modifyWindowLayout_reducer: Gui.Reducer = (state, action) => {
    const { id, offset, layoutType, event } = action.payload;
    const windowRecord = gui.findWindow(state, id);

    if (!windowRecord) return;

    windowRecord.modify = layoutType;

    switch (layoutType) {
        case ELayoutType.coords:
            windowRecord.mode === EWindowMode.float || gui.pickWindow(windowRecord, event);
            gui.moveWindow(state, windowRecord, 'left', offset);
            gui.moveWindow(state, windowRecord, 'top', offset);
            break;
        case ELayoutType.size:
            gui.resizeWindow(state, windowRecord, 'height', offset);
            gui.resizeWindow(state, windowRecord, 'width', offset);
            break;
        case ELayoutType.sizeE:
            gui.resizeWindow(state, windowRecord, 'width', offset);
            break;
        case ELayoutType.sizeS:
            gui.resizeWindow(state, windowRecord, 'height', offset);
            break;
        case ELayoutType.sizeW:
            gui.moveWindow(state, windowRecord, 'left', offset);
            gui.resizeWindow(state, windowRecord, 'width', invertCoords(offset));
            break;
        case ELayoutType.sizeN:
            gui.moveWindow(state, windowRecord, 'top', offset);
            gui.resizeWindow(state, windowRecord, 'height', invertCoords(offset));
            break;
    }
};

const collapseAll_reducer: Gui.Reducer = state => {
    const windowsShownIds = gui.windowsShownIds(state);
    const applyAction = (action: Window.Action) => (id: Id) => gui.processWindowAction(state, id, action);

    if (windowsShownIds.length) {
        windowsShownIds.forEach(applyAction(EWindowAction.collapse));
    } else {
        [...state.focusStask].forEach(applyAction(EWindowAction.restore));
    }
};

const guiSlice = createSlice({
    name: 'gui',
    initialState,
    reducers: {
        openDataNode: openDataNode_reducer,
        windowAction: windowAction_reducer,
        modifyWindowLayout: modifyWindowLayout_reducer,
        setWindowModify: setWindowModify_reducer,
        setWindowsBox: (state, action) => { state.windowsBox = action.payload },
        collapseAll: collapseAll_reducer,
        setInteractive: (state, action) => { state.interactive = action.payload },
        setGuiElm: (state, action) => { state.guiElm = action.payload }
    }
});

export const guiReducer = guiSlice.reducer;

export const {
    openDataNode,
    windowAction,
    modifyWindowLayout,
    setWindowModify,
    setWindowsBox,
    collapseAll,
    setInteractive,
    setGuiElm
} = guiSlice.actions;
