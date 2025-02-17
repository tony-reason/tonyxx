type LayoutType = import('utils/constants').ELayoutType;
type ImageUrl = string;

namespace Window {
    type Mode = import('utils/constants').EWindowMode;
    type Action = import('utils/constants').EWindowAction;
    type Collection = Map<Id, Window.Record>;

    interface Record {
        id: Id,
        dataNodeId: Id,
        mode: Mode,
        layout: Layout,
        order: number,
        focus?: boolean,
        modify?: LayoutType | null,
        actions?: Action[]
    }

    interface HeadProps {
        windowId: Id,
        windowMode: Mode,
        text?: string,
        thumb?: string,
        focus?: boolean,
        actions?: Action[]
    }

    interface ButtonSetProps {
        windowId: Id,
        windowMode?: Mode,
        actions?: Action[]
    }

    interface ButtonProps {
        windowId: Id,
        action: Action
        windowMode?: Mode,
    }

    interface ResizerProps {
        windowId: Id,
        mode?: LayoutType
    }

    interface ContentProps {
        content: any,
        ready: boolean,
        type?: DataNode.Type
    }

    interface Layout {
        left: number,
        top: number,
        width: number,
        height: number
    }
}

namespace Gui {
    type PointerEvent = React.MouseEvent;
    type PointerHandler = (event: Gui.PointerEvent, payload?: any) => any;

    interface Props {
        data: DataTree | null,
        desktopNodesIds: Id[],
        desktopImage?: ImageUrl
    }
}

namespace Desktop {
    interface Props {
        nodesIds: Id[],
        image?: ImageUrl
    }
}

namespace DataNodeIcon {
    interface Props {
        dataNodeId: Id,
        text?: string,
        image?: ImageUrl,
        type?: DataNode.Type,
        containerType?: DataNode.Type
    }
}

namespace Taskbar {
    interface Props {
        data: DataTree | null,
        windowsOpen: Window.Collection
    }

    interface IconProps {
        windowId: Id,
        action: Window.Action,
        focus: boolean,
        windowMode?: Window.Mode
        image?: ImageUrl,
    }
}

namespace Navigator {
    interface Props {
        data: DataTree | null
    }

    interface ItemProps {
        dataNode: DataNode | null,
        opened?: boolean,
        level?: number,
        callback?: Function
    }
}

namespace WindowsArea {
    interface Props {
        windowsOpen: Window.Collection,
        mode?: Window.Mode,
        elmRef?: React.RefObject
    }
}

interface Coords {
    x: number,
    y: number
}
