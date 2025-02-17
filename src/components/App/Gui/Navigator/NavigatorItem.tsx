import { memo } from 'react';
import { useDispatch } from 'react-redux';
import { openDataNode } from 'store/slices/Gui';
import { generateSubs } from 'concerns/Navigator';
import styles from 'GuiStyles/Navigator/NavigatorItem.module.scss';

export { NavigatorItem };

const NavigatorItem = memo(({ dataNode, opened = false, level = 0 }: Navigator.ItemProps) => {
    if (!dataNode) return null;

    const subs = generateSubs(dataNode, level + 1);
    const dispatch = useDispatch();
    const onClick = (event: Gui.PointerEvent) => {
        event.stopPropagation();
        dispatch(openDataNode(dataNode.id));
    };
    const styleModule = [
        styles.NavigatorItem,
        subs ? styles.parent : '',
        opened ? styles.opened : styles.closed
    ].join(' ');
    const thumbStyle = {
        backgroundImage: `url(${dataNode.data.thumb})`
    };

    return (
        <div className={styleModule} data-level={level}>
            <div className={styles.data} data-level={level} {...{ onClick }}>
                <div className={styles.thumb} style={thumbStyle}></div>
                <div className={styles.name}>
                    {dataNode.data.name}
                </div>
            </div>
            {subs && <div className={styles.subs} data-level={level}>
                {subs}
            </div>}
        </div>
    );
});
