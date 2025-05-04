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
import { setUser } from './redux/slices/user';
import PrescriptionForm from './components/PrescriptionForm/PrescriptionForm';
import Employees from './components/Employees/Employees';
import EmployeeForm from './components/EmployeeForm/EmployeeForm';
import Dashboard from './components/Dashboard/Dashboard';
import { setAccessToken } from './redux/slices/access_token';
import { validateToken } from './utils/checkToken';
import { ToastContainer } from 'react-toastify';

function App() {
  const user = useSelector((state: RootState) => state.user.user);
  const accessToken = useSelector((state: RootState) => state.accessToken.accessToken)
  const dispatch = useDispatch();

  useEffect(() => {
    if (accessToken && !validateToken(accessToken)) {
    }
  }, [accessToken]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedAccessToken = localStorage.getItem("access_token");

    if (storedUser && storedAccessToken) {
      try {
        const parsedUser = JSON.parse(storedUser); // Only parse the user
        dispatch(setUser(parsedUser));
        dispatch(setAccessToken(storedAccessToken));
      } catch (err) {
        console.error("Failed to parse user from localStorage:", err);
        localStorage.removeItem("user");
        localStorage.removeItem("access_token");
      }
    }
  }, [dispatch]);

  return (
    <div className='App'>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      {user && <Sidebar />}
      <div className='content'>
        {user && <Header />}
        <Routes>
          {!user && <Route path="/" element={<LoginForm />} />}
          <Route
            path='/'
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route
            path='/employees'
            element={
              <RequireAuth>
                <Employees />
              </RequireAuth>
            }
          />
          <Route
            path='/new_employee'
            element={
              <RequireAuth>
                <EmployeeForm />
              </RequireAuth>
            }
          />
          <Route
            path="/edit_employee/:employee_id"
            element={
              <RequireAuth>
                <EmployeeForm />
              </RequireAuth>
            }
          />
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
