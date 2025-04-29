import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './redux/store';
import LoginForm from './components/LoginForm/LoginForm';
import RequireAuth from './components/RequiredAuth/RequiredAuth';
import TransferForm from './components/TransferForm/TransferForm';
import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import './App.css'
import Transfers from './components/Transfers/Transfers';
import Patients from './components/Patients/Patients';
import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Header/Header';
import Prescriptions from './components/Prescriptions/Prescriptions';
import PatientForm from './components/PatientForm/PatientForm';
import { checkToken } from './utils/checkToken';
import { setUser } from './redux/slices/user';
import PrescriptionForm from './components/PrescriptionForm/PrescriptionForm';

function App() {
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedAccessToken = localStorage.getItem("access_token")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        dispatch(setUser(parsedUser));
      } catch (err) {
        console.error("Failed to parse user from localStorage:", err);
        localStorage.removeItem("user");
      }
    }
  }, [dispatch]);

  useEffect(() => {
    checkToken({ dispatch })
  }, [])

  return (
    <div className='App'>
      {user && <Sidebar />}
      <div className='content'>
        {user && <Header />}
        <Routes>
          {!user && <Route path="/" element={<LoginForm />} />}
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
            path="/edit_transfer/:transfer_id"
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
          <Route
            path="/new_patient"
            element={
              <RequireAuth>
                <PatientForm />
              </RequireAuth>
            }
          />
          <Route
            path="/edit_patient/:patient_id"
            element={
              <RequireAuth>
                <PatientForm />
              </RequireAuth>
            }
          />
          <Route
            path="/prescriptions"
            element={
              <RequireAuth>
                <Prescriptions />
              </RequireAuth>
            }
          />
          <Route
            path="/new_prescription"
            element={
              <RequireAuth>
                <PrescriptionForm />
              </RequireAuth>
            }
          />
          <Route
            path="/edit_prescription/:prescription_id"
            element={
              <RequireAuth>
                <PrescriptionForm />
              </RequireAuth>
            }
          />
        </Routes>
      </div>

    </div>
  );
}

export default App;
