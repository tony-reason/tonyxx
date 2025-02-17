import { useDispatch } from 'react-redux';
import { openDataNode } from 'store/slices/Gui';
import styles from 'GuiStyles/DataNodeIcon.module.scss';

export { DataNodeIcon };

const DataNodeIcon = ({ dataNodeId, text, image, type, containerType }: DataNodeIcon.Props) => {
    const dispatch = useDispatch();
    const onClick = () => dispatch(openDataNode(dataNodeId));
    const styleModule = [
        styles.DataNodeIcon,
        type ? styles[type] : '',
        containerType ? styles[`container_${containerType}`] : ''
    ].join(' ');
    const imageStyle = {
        backgroundImage: `url(${image})`
    };

    return (
        <div className={styleModule} {...{ onClick }}>
            <div className={styles.image} style={imageStyle}></div>
            <div className={styles.text}>
                {text}
            </div>
        </div>
    );
};
