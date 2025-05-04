import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from "react-redux";  // This should be at the top
import userReducer from './slices/user';
import accessTokenReducer from './slices/access_token'
import userIDReducer from './slices/userID'
import patientIDReducer from './slices/patientID'
import prescriptionIDReducer from './slices/prescriptionID'
import transferIDReducer from './slices/transferID'

export const store = configureStore({
    reducer: {
        user: userReducer,
        accessToken: accessTokenReducer,
        userID: userIDReducer,
        patientID: patientIDReducer,
        prescriptionID: prescriptionIDReducer,
        transferID: transferIDReducer
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

// Custom hook for useDispatch with proper types
export const useAppDispatch = () => useDispatch<AppDispatch>();
