import { useSelector } from 'react-redux';
import { generateIcons } from 'concerns/Desktop';
import styles from 'GuiStyles/Desktop.module.scss';

export { Desktop };

const Desktop = ({ nodesIds, image }: Desktop.Props) => {
    const nodesHash = useSelector((state: RootState) => state.dataSystem.dataNodesHash);
    const icons = generateIcons(nodesHash, nodesIds);
    const style = {
        backgroundImage: `url(${image})`
    };

    return (
        <div className={styles.Desktop} {...{ style }}>
            {icons}
        </div>
    );
};
