export enum EWindowMode {
    float = 'float',
    left = 'left',
    right = 'right',
    fullscreen = 'fullscreen',
    collapse = 'collapse',
    close = 'close',
    none = ''
}

export enum EFetchState {
    idle = 'idle',
    success = 'success',
    fail = 'fail'
}

export enum EWindowAction {
    collapse = 'collapse',
    fullscreen = 'fullscreen',
    left = 'left',
    right = 'right',
    toggleFullscreen = 'toggleFullscreen',
    close = 'close',
    restore = 'restore',
    focus = 'focus',
    storeLayout = 'storeLayout',
    none = ''
}

export enum ELayoutType {
    coords = 'coords',
    size = 'size',
    sizeW = 'sizeW',
    sizeE = 'sizeE',
    sizeN = 'sizeN',
    sizeS = 'sizeS'
}

export enum EMouseButton {
    main = 0,
    aux = 1,
    second = 2
}

export enum EDataNodeType {
    directory = 'directory',
    binary = 'binary',
    text = 'text',
    html = 'html'
}
