import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/user';
import accessTokenReducer from './slices/access_token'
import userIDReducer from './slices/userID'
import prescriptionIDReducer from './slices/prescriptionID'
import { useDispatch } from "react-redux";  // This should be at the top

export const store = configureStore({
    reducer: {
        user: userReducer,
        accessToken: accessTokenReducer,
        userID: userIDReducer,
        prescriptionID: prescriptionIDReducer
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

// Custom hook for useDispatch with proper types
export const useAppDispatch = () => useDispatch<AppDispatch>();
