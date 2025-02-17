import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export { useClickOutside };

const useClickOutside = (elm: HTMLElement | null, callback: AnyFunction) => {
    const guiElm = useSelector((state: RootState) => state.gui.guiElm);
    const clickHandler = (event: Gui.PointerEvent) => {
        if (event.target != elm) callback(event, elm);
    };
    const onRender = () => {
        if (!guiElm) return;

        guiElm.addEventListener('click', clickHandler);
        return () => guiElm.removeEventListener('click', clickHandler);
    };

    useEffect(onRender, [elm, guiElm, callback]);
};
