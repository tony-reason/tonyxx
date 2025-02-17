import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchInitData } from 'store/slices/DataSystem';
import { Gui } from 'GuiComponents';
import { EFetchState } from 'utils/constants';
import styles from 'styles/components/App.module.scss';

export { App };

const App = () => {
    const dispatch = useDispatch<any>();
    const dataSystem = useSelector((state: RootState) => state.dataSystem);
    const onRender = () => { dispatch(fetchInitData()) };

    useEffect(onRender, []);

    if (dataSystem.fetchState !== EFetchState.success) return null;

    return (
        <div className={styles.App}>
            <Gui
                data={dataSystem.dataTree}
                desktopNodesIds={dataSystem.desktopNodesIds}
                desktopImage={dataSystem.desktopImage}
            />
        </div>
    );
};
