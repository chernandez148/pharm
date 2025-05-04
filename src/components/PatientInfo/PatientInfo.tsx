import './PatientInfo.css'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { formatDate } from '../../utils/dateUtils';
import { LiaPrescriptionSolid } from "react-icons/lia";
import { setPatientID } from '../../redux/slices/patientID';
import SearchForm from '../SearchForm/SearchForm';
import { useFetchByID } from '../../hooks/useFetchByID';
import fetchPatientsByID from '../../services/patients/getPatientByID';


function PatientInfo() {
    const accessToken = useSelector((state: RootState) => state.accessToken.accessToken)
    const patientID = useSelector((state: RootState) => state.patientID.patientID)
    const { data: patientData, isLoading, isError } = useFetchByID({
        queryKey: "patient",
        queryFn: fetchPatientsByID,
        id: patientID,
        token: accessToken
    });
    const dispatch = useDispatch()

    const patient = patientData?.patient || []

    return (
        <div className='PatientInfo' style={{ width: patientID ? "300px" : "0" }}>
            <h3>Patient Info</h3>
            <div className='patient-info-wrapper'>
                <p><strong>Private Info:</strong></p>
                <p>{patient.first_name} {patient.last_name}</p>
                <p>{patient.email}</p>
                <p>{formatDate(patient.dob).formattedDate}</p>
                <p>{patient.sex}</p>
                <br />
                <p><strong>Contact Info:</strong></p>
                <p>{patient.address}</p>
                <p>{patient.phone_number}</p>
                <br />
                <p><strong>Patient's Prescriptions</strong></p>
                <SearchForm />
                {patient.prescriptions?.map((prescription: any) => {
                    return (
                        <button>{LiaPrescriptionSolid({})} <p>{prescription?.medication}</p></button>
                    )
                })}
            </div>
            <button style={{ margin: "1rem" }} onClick={() => dispatch(setPatientID(null))}>Close</button>
        </div>
    )
}

export default PatientInfo