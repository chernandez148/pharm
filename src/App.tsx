import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './redux/store';
import LoginForm from './components/LoginForm/LoginForm';
import RequireAuth from './components/RequiredAuth/RequiredAuth';
import TransferForm from './components/TransferForm/TransferForm';
import { login as setLogin } from './redux/slices/authSlice';
import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import './App.css'
import Transfers from './components/Transfers/Transfers';
import Patients from './components/Patients/Patients';
import Sidebar from './components/Sidebar/Sidebar';

function App() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        dispatch(setLogin(parsedUser));
      } catch (err) {
        console.error("Failed to parse user from localStorage:", err);
        localStorage.removeItem("user");
      }
    }
  }, [dispatch]);

  return (
    <div className='App'>
      {isAuthenticated && <Sidebar />}
      <div className='content'>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route
            path="/transfer"
            element={
              <RequireAuth>
                <Transfers />
              </RequireAuth>
            }
          />
          <Route
            path="/new_transfer"
            element={
              <RequireAuth>
                <TransferForm />
              </RequireAuth>
            }
          />
          <Route
            path="/patients"
            element={
              <RequireAuth>
                <Patients />
              </RequireAuth>
            }
          />
        </Routes>
      </div>

    </div>
  );
}

export default App;
