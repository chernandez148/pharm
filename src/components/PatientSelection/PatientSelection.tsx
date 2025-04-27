import { useFormikContext } from 'formik';
import { useFetchByID } from '../../hooks/useFetchByID';
import fetchPatientsByPharmacyID from '../../services/patients/getPatientsByPharmacyID';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { Patient } from '../../types/patient';
import SearchForm from '../SearchForm/SearchForm';
import './PatientSelection.css'

function PatientSelection({
    togglePatientSelection,
    setTogglePatientSelection,
    setSelectedPatient
}: {
    togglePatientSelection: boolean
    setTogglePatientSelection: (value: boolean) => void;
    setSelectedPatient
    : (value: { patient: string; id: number }) => void;
}) {
    const user = useSelector((state: RootState) => state.user.user);
    let setFieldValue: ((field: string, value: any) => void) | undefined;

    try {
        const formik = useFormikContext<any>();
        setFieldValue = formik?.setFieldValue;
    } catch (error) {
        // Not inside a Formik context
        setFieldValue = undefined;
    }

    const { data: patientsData, isLoading, isError } = useFetchByID({
        queryKey: "patients",
        queryFn: fetchPatientsByPharmacyID,
        id: user.pharmacy_id,
    });

    const patients: Patient[] = patientsData?.patients || [];

    return (
        <div
            className="PatientSelection"
            style={{ width: togglePatientSelection ? '400px' : '0' }}
        >
            <div className="patient-selection-wrapper">
                <h3>Patient Selection</h3>
                <SearchForm />
                {isLoading && <p>Loading...</p>}
                {isError && <p>Error loading pharmacies.</p>}

                <ul>
                    {patients.map((patient) => (
                        <li key={patient.id}>
                            <div>
                                <strong>{patient.first_name} {patient.last_name}</strong>
                                <br />
                                <small>{patient.phone_number}</small>
                                <br />
                                <small>{patient.email}</small>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedPatient({
                                        id: patient.id,
                                        patient: `${patient.first_name} ${patient.last_name}`,
                                    });
                                    if (setFieldValue) {
                                        setFieldValue('patient_id', patient.id);
                                    }
                                    setTogglePatientSelection(false);
                                }}
                            >
                                Select
                            </button>
                        </li>
                    ))}
                </ul>

                <button onClick={() => setTogglePatientSelection(false)}>Close</button>
            </div>
        </div>)
}

export default PatientSelection