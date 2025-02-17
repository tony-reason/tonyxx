import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { DataServer } from 'DataComponents';
import { safeJsonParse } from 'helpers/var';
import { EFetchState } from 'utils/constants';
import { ApiResources, dataUrl } from 'utils/config';

export { fetchInitData, dataSystemReducer };

const fetchData = () => fetch(dataUrl(ApiResources.init))
    .then(response => response.json());

const fetchInitData = createAsyncThunk(
    'datasystem/fetchData',
    fetchData
);

const initialState: DataSystem.State = {
    dataTree: null,
    dataNodesHash: {},
    desktopNodesIds: [],
    fetchState: EFetchState.idle
};

const initializeSlice: DataSystem.Reducer = (state, action) => {
    const inputData = safeJsonParse(action.payload);
    const { dataNodes } = inputData;
    const dataSystem = DataServer.initialize(dataNodes);
    const stateData = {
        dataTree: dataSystem.tree,
        dataNodesHash: dataSystem.nodes,
        desktopNodesIds: inputData.desktopNodesIds,
        desktopImage: inputData.desktopImage,
        fetchState: EFetchState.success
    };

    Object.assign(state, stateData);
};

const failSlice: DataSystem.Reducer = state => { state.fetchState = EFetchState.fail; };

const dataSystemSlice = createSlice({
    name: 'dataSystem',
    initialState,
    reducers: {},
    extraReducers: builder => builder
        .addCase(fetchInitData.fulfilled, initializeSlice)
        .addCase(fetchInitData.rejected, failSlice)
});

const dataSystemReducer = dataSystemSlice.reducer;
