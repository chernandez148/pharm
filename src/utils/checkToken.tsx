import { store } from '../redux/store';
import { setUser } from '../redux/slices/user';
import { setAccessToken } from '../redux/slices/access_token';

export const cleanToken = (token: unknown): string => {
    if (typeof token !== 'string') {
        console.error("Invalid token type:", typeof token);
        return "";
    }
    return token.replace(/^"|"$/g, '').trim();
};

export const validateToken = (token: string): boolean => {
    // Basic JWT structure validation
    const parts = token.split('.');
    if (parts.length !== 3 || token.length < 30) {
        return false;
    }

    // Check expiration
    try {
        const payload = JSON.parse(atob(parts[1]));
        if (payload.exp && payload.exp * 1000 < Date.now()) {
            forceLogout();
            return false;
        }
        return true;
    } catch (e) {
        console.error("Token validation error:", e);
        forceLogout();
        return false;
    }
};

export const forceLogout = () => {
    try {
        // Clear Redux state using store directly
        store.dispatch(setAccessToken(""));
        store.dispatch(setUser(null));
        
        // Clear localStorage safely
        try {
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
        } catch (e) {
            console.error("Failed to clear localStorage:", e);
        }
        
        // Redirect to login (if in browser environment)
        if (typeof window !== 'undefined') {
            window.location.href = '/login'; // Changed to explicit login path
            window.location.reload(); // Ensure clean state
        }
    } catch (e) {
        console.error("Logout failed:", e);
    }
};

export const getTokenPayload = (token: string) => {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        
        const payload = JSON.parse(atob(parts[1]));
        return {
            ...payload,
            // Add common payload checks
            exp: payload.exp ? new Date(payload.exp * 1000) : null,
            iat: payload.iat ? new Date(payload.iat * 1000) : null
        };
    } catch (e) {
        console.error("Failed to parse token payload:", e);
        return null;
    }
};