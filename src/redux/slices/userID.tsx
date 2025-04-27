import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    userID: null,
};

const userIDSlice = createSlice({
    name: 'userID',
    initialState,
    reducers: {
        setUserID(state, action) {
            state.userID = action.payload;
        }
    },
});

export const { setUserID } = userIDSlice.actions;

export default userIDSlice.reducer;
