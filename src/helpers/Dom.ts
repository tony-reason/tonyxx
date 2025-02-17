import {
    spreadValue,
    mapObject,
    mapObjectValues
} from 'helpers/var';

export {
    setCssVar,
    getCssVar,
    setCssVarMax,
    randomWindowLayout
};

const root = document.documentElement;

const setCssVar = (name: string, value: any, element?: HTMLElement) => {
    (element ?? root).style.setProperty(name, `${value}`);
};

const getCssVar = (name: string, element?: HTMLElement) => (element ?? root).style.getPropertyValue(name);

const setCssVarMax = (name: string, value: number, element?: HTMLElement) => {
    setCssVar(name, Math.max(value, +getCssVar(name, element)), element);
};

const randomWindowLayout = (windowsBox = document.body.getBoundingClientRect()): Window.Layout => {
    type Layout = Pick<DOMRect, 'width' | 'height'>;

    const spread = .25;
    const ratio: Layout = {
        width: 3,
        height: 2
    };
    const source = {
        width: 'left',
        height: 'top'
    } as TObject<string>;
    const boxSize = {
        width: windowsBox.width,
        height: windowsBox.height,
    };
    const avgWindowSize = mapObjectValues(
        boxSize,
        (size: number, key: keyof Layout) => size / ratio[key]
    );
    const windowSize = mapObjectValues(
        avgWindowSize,
        (size: number) => spreadValue(size, spread)
    );
    const windowCoords = mapObject(
        windowSize,
        (size: number, key: keyof Layout) => ({ [source[key]]: spreadValue((boxSize[key] - size) / 2, spread) })
    );
    const layout = {
        ...windowSize,
        ...windowCoords
    };

    return layout as Window.Layout;
};
