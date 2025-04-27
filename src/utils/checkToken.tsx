import { jwtDecode } from 'jwt-decode';
import { AppDispatch } from "../redux/store";
import { setUser } from '../redux/slices/user';
import { setAccessToken } from '../redux/slices/access_token';

export const checkToken = ({ dispatch }: { dispatch: AppDispatch }) => {
    const token = localStorage.getItem("access_token");
    if (!token) return dispatch(setUser(null));

    try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;

        if (decoded.exp && decoded.exp > now) {
            dispatch(setAccessToken({ token, userId: decoded.sub }));
        } else {
            dispatch(setUser(null));
        }
    } catch (e) {
        dispatch(setUser(null));
    }
};
