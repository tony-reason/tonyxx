import { memo } from 'react';
import { Spinner } from 'GuiComponents';
import styles from 'GuiStyles/Window/WindowContent.module.scss';
import 'styles/theme/content_theme.scss';

export { WindowContent };

const WindowContent = memo(({ content, type, ready = true }: Window.ContentProps) => {
    const styleModule = [
        styles.WindowContent,
        type ? styles[type] : ''
    ].join(' ');

    return (
        <div className={styleModule}>
            {content}
            {ready || <Spinner />}
        </div>
    );
});
