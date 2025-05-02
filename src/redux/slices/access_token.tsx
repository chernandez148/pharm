import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
    accessToken: "", // Consistent naming with your usage
};

const accessTokenSlice = createSlice({
    name: 'accessToken',
    initialState,
    reducers: {
        setAccessToken(state, action: PayloadAction<string>) {
            // Clean the token before storing
            const token = action.payload.replace(/^"|"$/g, '').trim();
            if (!token) {
                console.error("Received empty token");
                return;
            }
            state.accessToken = token;
        },
        clearAccessToken(state) {
            state.accessToken = "";
        }
    },
});

export const { setAccessToken, clearAccessToken } = accessTokenSlice.actions;
export default accessTokenSlice.reducer;