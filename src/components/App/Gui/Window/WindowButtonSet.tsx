import { memo } from 'react';
import { generateButtons } from 'concerns/Window';
import styles from 'GuiStyles/Window/WindowButtonSet.module.scss';

export { WindowButtonSet };

const WindowButtonSet = memo(({ windowId, windowMode, actions }: Window.ButtonSetProps) => {
    const buttons = generateButtons(windowId, actions, windowMode);

    return (
        <div className={styles.WindowButtonSet}>
            {buttons}
        </div>
    );
});
