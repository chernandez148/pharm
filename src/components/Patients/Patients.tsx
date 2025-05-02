import './Patients.css'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { formatDate } from '../../utils/dateUtils';
import PatientInfo from '../PatientInfo/PatientInfo';
import fetchPatientsByPharmacyID from '../../services/patients/getPatientsByPharmacyID';
import { useFetchByID } from '../../hooks/useFetchByID';
import { Link, useNavigate } from 'react-router-dom';
import { FaSort } from "react-icons/fa6";
import { IoMdMore } from "react-icons/io";
import { useState } from 'react';
import { CiEdit } from "react-icons/ci";
import { IoTrashSharp } from "react-icons/io5";
import { setUserID } from '../../redux/slices/userID';


function Patients() {
    const user = useSelector((state: RootState) => state.user.user);
    const [toggleOptionBox, setToggleOptionBox] = useState(false)
    const [patientID, setPatientID] = useState(null)
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
                        <p>Action</p>
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
                                        <button className='viewBtn' onClick={() => {
                                            dispatch(setUserID(patient.id))
                                        }}>View</button>
                                        <button className='moreBtn' onClick={() => {
                                            setPatientID(patient.id)
                                            setToggleOptionBox((prevToggle) => !prevToggle)
                                        }}>{IoMdMore({})}</button>
                                    </p>
                                    <div className='optionBox' style={{ display: toggleOptionBox && patientID === patient.id ? "block" : "none" }}>
                                        <button onClick={() => navigate(`/edit_patient/${patient.id}`)}>{CiEdit({})} Edit</button>
                                        <button onClick={() => navigate(`/delete_patient/${patient.id}`)}>{IoTrashSharp({})} Delete</button>
                                    </div>
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