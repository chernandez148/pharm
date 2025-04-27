import './Prescriptions.css'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { setPrescriptionID } from '../../redux/slices/prescriptionID';
import { formatDate } from '../../utils/dateUtils';
import PrescriptionInfo from '../PrescriptionInfo/PrescriptionInfo';
import { useFetchByID } from '../../hooks/useFetchByID';
import fetchPrescriptionsByPharmacyID from '../../services/prescriptions/getPrescriptionsByPharmacyID';
import { Link, useNavigate } from 'react-router-dom';

function Prescriptions() {
    const user = useSelector((state: RootState) => state.user.user);
    const { data: prescriptionsData, isLoading, isError } = useFetchByID({
        queryKey: "prescriptions",
        queryFn: fetchPrescriptionsByPharmacyID,
        id: user.pharmacy_id,
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();

    if (isLoading) return <div>Loading prescriptions...</div>;
    if (isError) return <div>Error loading prescriptions.</div>;

    const prescriptions = prescriptionsData?.prescriptions || [];

    return (
        <div className='Prescriptions'>
            <div className='prescriptions-header'>
                <span></span>
                <h3>Prescriptions</h3>
                <Link to="/new_prescription">+ Add</Link>
            </div>
            <div className='prescriptions-wrapper'>
                <div className='table'>
                    <div className='table-header'>
                        <p style={{ display: "flex", width: "calc(80px - 1rem)" }}></p>
                        <p>Full Name</p>
                        <p>DOB</p>
                        <p>Phone Number</p>
                        <p>Medication</p>
                        <p>Dosage</p>
                        <p>Directions For Use</p>
                        <p>Quantity</p>
                        <p>Refills</p>
                        <p>Date Of Prescription</p>
                        <p>Date Last Filled</p>
                        <p>Prescriber's Full Name</p>
                        <p>Prescriber's DEA Number</p>
                        <p>Prescriber's Contact Info</p>
                    </div>
                    <div className='table-body'>
                        {prescriptions.map((prescription: any) => {
                            const patient = prescription.patient;
                            const prescriber = prescription.prescriber;

                            return (
                                <div className="table-row" key={prescription.id}>
                                    <div style={{ display: "flex", border: "1px solid #efefef", justifyContent: "space-evenly", width: "80px" }}>
                                        <button onClick={() => navigate(`/edit_prescription/${prescription.id}`)}>Edit</button>
                                        <button onClick={() => dispatch(setPrescriptionID(prescription.id))}>View</button>
                                    </div>
                                    <p>{`${patient?.first_name || 'N/A'} ${patient?.last_name || ''}`.trim() || 'N/A'}</p>
                                    <p>{formatDate(patient?.dob) || 'N/A'}</p>
                                    <p>{patient?.phone_number || 'N/A'}</p>
                                    <p>{prescription?.medication || 'N/A'}</p>
                                    <p>{prescription?.dosage || 'N/A'}</p>
                                    <p>{prescription?.directions_for_use || 'N/A'}</p>
                                    <p>{prescription?.quantity || 'N/A'}</p>
                                    <p>{prescription?.refills || 'N/A'}</p>
                                    <p>{formatDate(prescription?.date_of_prescription) || 'N/A'}</p>
                                    <p>{formatDate(prescription?.date_last_filled) || 'N/A'}</p>
                                    <p>{prescriber?.full_name || 'N/A'}</p>
                                    <p>{prescriber?.dea_number || 'N/A'}</p>
                                    <p>{prescriber?.contact_info || 'N/A'}</p>
                                </div>

                            );
                        })}
                    </div>
                </div>
            </div>
            <PrescriptionInfo />
        </div>
    );
}

export default Prescriptions;
