type HistoryStep = 'previous' | 'current' | 'next';
type DirectionProp = 'left' | 'top';
type SizeProp = 'width' | 'height';

namespace Window {
    interface HistoryRecord {
        mode?: Mode,
        layout?: Layout
    }

    interface History {
        previous: HistoryRecord,
        current: HistoryRecord,
        next: HistoryRecord
    }
}

namespace Gui {
    type Reducer = (state: State, action: Action) => State | void;

    interface State {
        windowsOpen: Window.Collection,
        windowsHistory: Map<Id, Window.History>,
        focusStask: Id[],
        interactive: boolean,
        guiElm: any,
        windowsBox?: DOMRect
    }

    interface Action {
        type: string,
        payload: any
    }
}
