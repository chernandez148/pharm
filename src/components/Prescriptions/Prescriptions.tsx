import './Prescriptions.css'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { setPrescriptionID } from '../../redux/slices/prescriptionID';
import { formatDate } from '../../utils/dateUtils';
import PrescriptionInfo from '../PrescriptionInfo/PrescriptionInfo';
import { useFetchByID } from '../../hooks/useFetchByID';
import fetchPrescriptionsByPharmacyID from '../../services/prescriptions/getPrescriptionsByPharmacyID';
import { Link, useNavigate } from 'react-router-dom';
import { FaSort } from 'react-icons/fa6';
import { IoMdMore } from 'react-icons/io';
import { useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { IoTrashSharp } from 'react-icons/io5';

function Prescriptions() {
    const user = useSelector((state: RootState) => state.user.user);
    const [toggleOptionBox, setToggleOptionBox] = useState(false)
    const [ID, setID] = useState(null)
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

    console.log(prescriptions)

    return (
        <div className='Prescriptions'>
            <div className='prescriptions-header'>
                <h3>Prescriptions</h3>
                <Link to="/new_prescription">+ Add</Link>
            </div>
            <div className='prescription-wrapper'>
                <div className='table'>
                    <div className='table-header'>
                        <p># <button>{FaSort({})}</button></p>
                        <p>Full Name <button>{FaSort({})}</button></p>
                        <p>DOB <button>{FaSort({})}</button></p>
                        <p>Phone Number <button>{FaSort({})}</button></p>
                        <p>Medication <button>{FaSort({})}</button></p>
                        <p>Dosage <button>{FaSort({})}</button></p>
                        <p>Directions For Use <button>{FaSort({})}</button></p>
                        <p>Quantity <button>{FaSort({})}</button></p>
                        <p>Refills <button>{FaSort({})}</button></p>
                        <p>Date Of Prescription <button>{FaSort({})}</button></p>
                        <p>Date Last Filled <button>{FaSort({})}</button></p>
                        <p>Prescriber's Full Name <button>{FaSort({})}</button></p>
                        <p>Prescriber's DEA Number <button>{FaSort({})}</button></p>
                        <p>Prescriber's Contact Info <button>{FaSort({})}</button></p>
                        <p>Action</p>
                    </div>
                    <div className='table-body'>
                        {prescriptions.map((prescription: any, index: number) => {
                            const patient = prescription.patient;
                            const prescriber = prescription.prescriber;
                            return (
                                <div className="table-row" key={prescription.id}>
                                    <p>{index + 1}</p>
                                    <p>{`${patient?.first_name || 'N/A'} ${patient?.last_name || ''}`.trim() || 'N/A'}</p>
                                    <p>{formatDate(patient?.dob).formattedDate || 'N/A'}</p>
                                    <p>{patient?.phone_number || 'N/A'}</p>
                                    <p>{prescription?.medication || 'N/A'}</p>
                                    <p>{prescription?.dosage || 'N/A'}</p>
                                    <p>{prescription?.directions_for_use || 'N/A'}</p>
                                    <p>{prescription?.quantity || 'N/A'}</p>
                                    <p>{prescription?.refills || 'N/A'}</p>
                                    <p>{formatDate(prescription?.date_of_prescription).formattedDate || 'N/A'}</p>
                                    <p>{formatDate(prescription?.date_last_filled).formattedDate || 'N/A'}</p>
                                    <p>{prescriber?.full_name || 'N/A'}</p>
                                    <p>{prescriber?.dea_number || 'N/A'}</p>
                                    <p>{prescriber?.contact_info || 'N/A'}</p>
                                    <p>
                                        <button onClick={() => dispatch(setPrescriptionID(prescription.id))} className='viewBtn'>View</button>
                                        <button className='moreBtn' onClick={() => {
                                            setID(prescription.id)
                                            setToggleOptionBox((prevToggle) => !prevToggle)
                                        }}>{IoMdMore({})}</button>
                                    </p>  
                                    <div className='optionBox' style={{ display: toggleOptionBox && prescription.id === ID ? "block" : "none" }}>
                                        <button onClick={() => navigate(`/edit_prescription/${prescription.id}`)}>{CiEdit({})} Edit</button>
                                        <button onClick={() => navigate(`/delete_prescription/${prescription.id}`)}>{IoTrashSharp({})} Delete</button>
                                    </div>                       
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
