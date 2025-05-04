import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    patientID: null,
};

const patientIDSlice = createSlice({
    name: 'patientID',
    initialState,
    reducers: {
        setPatientID(state, action) {
            state.patientID = action.payload;
        }
    },
});

export const { setPatientID } = patientIDSlice.actions;

export default patientIDSlice.reducer;
