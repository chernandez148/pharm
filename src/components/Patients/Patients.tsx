import './Patients.css'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { formatDate } from '../../utils/dateUtils';
import PatientInfo from '../PatientInfo/PatientInfo';
import fetchPatientsByPharmacyID from '../../services/patients/getPatientsByPharmacyID';
import { useFetchByID } from '../../hooks/useFetchByID';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaSort } from "react-icons/fa6";
import { IoMdMore } from "react-icons/io";
import { useState } from 'react';
import { CiEdit } from "react-icons/ci";
import { IoTrashSharp } from "react-icons/io5";
import { AiOutlinePlus } from 'react-icons/ai';
import formatUserRole from '../../utils/formatUserRoles';
import { FiCheckCircle } from 'react-icons/fi';
import { setPatientID } from '../../redux/slices/patientID';


function Patients() {
    const user = useSelector((state: RootState) => state.user.user);
    const [ID, setID] = useState(null)
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
                <div className='patient-action-item'>
                    <button title='New Patient' onClick={() => navigate(`/new_patient`)}>
                        {AiOutlinePlus({})}
                    </button>
                    <button disabled={!ID} title={!ID ? "No patient selected" : 'View Patient'} onClick={() => dispatch(setPatientID(ID))}>
                        {FaEye({})}
                    </button>
                    <button disabled={!ID} title={!ID ? "No patient selected" : 'Edit patient'} onClick={() => navigate(`/edit_patient/${ID}`)}>
                        {CiEdit({})}
                    </button>
                    <button
                        disabled={!ID || formatUserRole(user.role) !== "Admin"}
                        title={!ID ? "No patient selected" : formatUserRole(user.role) !== "Admin" ? "Requires Admin privileges" : "Delete patient"}
                        onClick={() => navigate(`/delete_patient/${ID}`)}
                    >
                        {IoTrashSharp({})}
                    </button>
                </div>
            </div>
            <div className='patient-wrapper'>
                <div className='table'>
                    <div className='table-header'>
                        <p># <button>{FaSort({})}</button></p>
                        <p>Full Name <button>{FaSort({})}</button></p>
                        <p>Email <button>{FaSort({})}</button></p>
                        <p>Sex <button>{FaSort({})}</button></p>
                        <p>DOB <button>{FaSort({})}</button></p>
                        <p>Address <button>{FaSort({})}</button></p>
                        <p>Phone Number <button>{FaSort({})}</button></p>
                        <p>Select</p>
                    </div>
                    <div className='table-body'>
                        {patients.map((patient: any, index: number) => {
                            return (
                                <div className="table-row" key={patient.id}>
                                    <p>{index + 1}</p>
                                    <p>{`${patient.first_name} ${patient.last_name}`}</p>
                                    <p>{patient.email}</p>
                                    <p>{patient.sex}</p>
                                    <p>{formatDate(patient.dob).formattedDate}</p>
                                    <p>{patient.address}</p>
                                    <p>{patient.phone_number}</p>
                                    <p>
                                        <button
                                            className='moreBtn'
                                        >
                                            <input
                                                type='radio'
                                                checked={ID === patient.id}
                                                onChange={() => setID(patient.id)}
                                            />
                                        </button>
                                    </p>
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