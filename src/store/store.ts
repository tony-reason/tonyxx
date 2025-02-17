import { configureStore } from '@reduxjs/toolkit';
import { enableMapSet } from 'immer';
import { dataSystemReducer } from 'store/slices/DataSystem';
import { guiReducer } from 'store/slices/Gui';

export { store };

const reducer = {
    dataSystem: dataSystemReducer,
    gui: guiReducer
};
const middlewareOpts = { serializableCheck: false };
const middleware = (defaultMiddleware: Function) => defaultMiddleware(middlewareOpts);
const store = configureStore({
    reducer,
    middleware
});

enableMapSet();
