import './Patients.css'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { formatDate } from '../../utils/dateUtils';
import { setUserID } from '../../redux/slices/userID';
import PatientInfo from '../PatientInfo/PatientInfo';
import fetchPatientsByPharmacyID from '../../services/patients/getPatientsByPharmacyID';
import { useFetchByID } from '../../hooks/useFetchByID';
import { Link, useNavigate } from 'react-router-dom';

function Patients() {
    const user = useSelector((state: RootState) => state.user.user);
    const navigate = useNavigate();
    const { data: patientsData, isLoading, isError } = useFetchByID({
        queryKey: "patients",
        queryFn: fetchPatientsByPharmacyID,
        id: user.pharmacy_id,
    });

    const dispatch = useDispatch()

    if (isLoading) return <div>Loading transfers...</div>;
    if (isError) return <div>Error loading transfers.</div>;

    const patients = patientsData?.patients || [];

    return (
        <div className='Patients'>
            <div className='patients-header'>
                <h3>Patients</h3>
                <Link to="/new_patient">+ Add</Link>
            </div>
            <div className='patients-wrapper'>
                <div className='table'>
                    <div className='table-header'>
                        <p style={{ display: "flex", width: "calc(80px - 1rem)" }}></p>
                        <p>Full Name</p>
                        <p>Email</p>
                        <p>Sex</p>
                        <p>DOB</p>
                        <p>Address</p>
                        <p>Phone Number</p>
                    </div>
                    <div className='table-body'>
                        {patients.map((patient: any) => {
                            return (
                                <div className="table-row" key={patient.id}>
                                    <div style={{ display: "flex", border: "1px solid #efefef", justifyContent: "space-evenly", width: "80px" }}>
                                        <button onClick={() => navigate(`/edit_patient/${patient.id}`)}>Edit</button>
                                        <button onClick={() => dispatch(setUserID(patient.id))}>View</button>
                                    </div>
                                    <p>{`${patient.first_name} ${patient.last_name}`}</p>
                                    <p>{patient.email}</p>
                                    <p>{patient.sex}</p>
                                    <p>{formatDate(patient.dob)}</p>
                                    <p>{patient.address}</p>
                                    <p>{patient.phone_number}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
            <PatientInfo />
        </div>
    )
}

export default Patients