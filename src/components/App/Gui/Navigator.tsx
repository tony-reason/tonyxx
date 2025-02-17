import { useState, useRef, memo } from 'react';
import { useClickOutside } from 'hooks/Gui';
import { NavigatorItem } from 'GuiComponents';
import styles from 'GuiStyles/Navigator.module.scss';

export { Navigator };

const Navigator = memo(({ data }: Navigator.Props) => {
    if (!data) return null;

    const [opened, setOpened] = useState(false);
    const navigatorRef = useRef(null);
    const onClick = (event: Gui.PointerEvent) => {
        event.stopPropagation();
        setOpened(!opened);
    };

    useClickOutside(navigatorRef.current, () => setOpened(false));

    return (
        <div className={styles.Navigator} ref={navigatorRef} {...{ onClick }}>
            <NavigatorItem dataNode={data} opened={opened} />
        </div>
    );
});
