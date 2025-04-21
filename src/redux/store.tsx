import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import { useDispatch } from "react-redux";  // This should be at the top

export const store = configureStore({
    reducer: {
        auth: authReducer,
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

// Custom hook for useDispatch with proper types
export const useAppDispatch = () => useDispatch<AppDispatch>();
