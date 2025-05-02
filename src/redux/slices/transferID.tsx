import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    transferID: null,
};

const transferIDSlice = createSlice({
    name: 'transferID',
    initialState,
    reducers: {
        setTransferID(state, action) {
            state.transferID = action.payload;
        }
    },
});

export const { setTransferID } = transferIDSlice.actions;

export default transferIDSlice.reducer;
