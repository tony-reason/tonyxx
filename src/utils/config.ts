import { EWindowAction } from 'utils/constants';

export {
    ApiResources,
    dataUrl,
    defaultWindowActions,
    error,
    storageKey,
    guiConfig,
    breakpoints,
    windowResizes,
    defaultThumb,
    url
};

export const env = import.meta.env;

enum ApiResources {
    init = env.VITE_API_RESOURCE_INIT
};

const dataUrl = (resource: ApiResources) => `${env['VITE_API_URL']}${resource}`;

const defaultWindowActions: EWindowAction[] = [
    EWindowAction.collapse,
    EWindowAction.left,
    EWindowAction.right,
    EWindowAction.toggleFullscreen,
    EWindowAction.close
];

const error = {
    noAppRoot: 'Required HTML element with id="root" for app container'
};

const storageKey = {
    windowLayout: 'windowLayout'
};

const guiConfig = {
    window: {
        min: {
            width: 207,
            height: 128
        } as TObject<number>
    },
    windowsBox: {
        bound: 20
    }
};

const breakpoints = {
    mobile: 576,
    tablet: 1024,
    desktop: 1400,
    desktopL: 2000
};

const windowResizes = ['sizeW', 'sizeE', 'sizeN', 'sizeS', 'size'] as LayoutType[];

const defaultThumb = (type?: DataNode.Type) => {
    const iconsPath = '/icons';
    const file_common = `${iconsPath}/file.png`;
    const icons = {
        directory: `${iconsPath}/directory.png`,
        text: `${iconsPath}/file.png`,
    } as { [key in DataNode.Type]: ImageUrl };

    return (type && icons[type]) ?? file_common;
};

const url = {
    search: {
        node: 'node'
    }
};
