import { memo } from 'react';
import { useDispatch } from 'react-redux';
import { collapseAll } from 'store/slices/Gui';
import { Navigator } from 'GuiComponents';
import { generateIcons } from 'concerns/Taskbar';
import styles from 'GuiStyles/Taskbar.module.scss';

export { Taskbar };

const Taskbar = memo(({ data, windowsOpen }: Taskbar.Props) => {
    const dispatch = useDispatch()
    const icons = generateIcons(windowsOpen);
    const onClick = () => dispatch(collapseAll(null));

    return (
        <div className={styles.Taskbar} {...{ onClick }}>
            <Navigator data={data} />
            {icons}
        </div>
    );
});
