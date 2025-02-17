namespace DataSystem {
    type Reducer = (state: State, action: Action) => State | void;

    interface State {
        dataTree: DataNode | null,
        dataNodesHash: DataNode.Collection,
        desktopNodesIds: Id[],
        desktopImage?: ImageUrl,
        fetchState: EFetchState
    }

    interface Action {
        payload: any
    }
}
