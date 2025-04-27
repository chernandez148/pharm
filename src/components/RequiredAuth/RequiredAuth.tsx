// components/RequireAuth.jsx
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../../redux/store';

function RequireAuth({ children }: { children: any }) {
    const user = useSelector((state: RootState) => state.user.user);

    if (!user) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default RequireAuth;
