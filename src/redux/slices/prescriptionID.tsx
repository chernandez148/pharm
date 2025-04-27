import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    prescriptionID: null,
};

const prescriptionIDSlice = createSlice({
    name: 'prescriptionID',
    initialState,
    reducers: {
        setPrescriptionID(state, action) {
            state.prescriptionID = action.payload;
        }
    },
});

export const { setPrescriptionID } = prescriptionIDSlice.actions;

export default prescriptionIDSlice.reducer;
