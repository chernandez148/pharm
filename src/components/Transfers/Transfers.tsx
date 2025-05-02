import './Transfer.css'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { formatDate } from '../../utils/dateUtils';
import { Link, useNavigate } from 'react-router-dom';
import { useFetchByID } from '../../hooks/useFetchByID';
import fetchTransfersByPharmacyID from '../../services/transfers/getTransfersByPharmacyID';
import { FaSort } from 'react-icons/fa6';
import { IoMdMore } from 'react-icons/io';
import { useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { IoTrashSharp } from 'react-icons/io5';
import { setTransferID } from '../../redux/slices/transferID';

function Transfers() {
    const user = useSelector((state: RootState) => state.user.user);
    const { data: transfersData, isLoading, isError } = useFetchByID({
        queryKey: "transfers",
        queryFn: fetchTransfersByPharmacyID,
        id: user?.pharmacy_id,
    });
    const [toggleOptionBox, setToggleOptionBox] = useState(false)
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const transfersSent = transfersData?.transfers.filter((transfer: any) => transfer.to_pharmacy.id === user.pharmacy_id);
    const transfersRecieved = transfersData?.transfers.filter((transfer: any) => transfer.from_pharmacy.id === user.pharmacy_id);

    console.log(transfersRecieved)

    const statusColors = {
        pending: '#FFF3B0',      // pastel yellow
        in_progress: '#A0C4FF',  // pastel blue
        completed: '#B9FBC0',    // pastel green
        cancelled: '#FFADAD',    // pastel red/pink
    };

    const getStatusColor = (status: string) => statusColors[status] || '#E0E0E0'; // light gray as fallback      

    if (isLoading) return <div>Loading transfers...</div>;
    if (isError) return <div>Error loading transfers.</div>;

    return (
        <div className='Transfers'>
            <div className='transfers-header'>
                <h3>Transfer Requests Sent</h3>
                <Link to="/new_transfer">+ Add</Link>
            </div>
            <div className='transfer-requests-sent'>
                <div className='table'>
                    <div className='table-header'>
                        <p># <button>{FaSort({})}</button></p>
                        <p>Date <button>{FaSort({})}</button></p>
                        <p>Request By <button>{FaSort({})}</button></p>
                        <p>From Pharmacy <button>{FaSort({})}</button></p>
                        <p>To Pharmacy <button>{FaSort({})}</button></p>
                        <p>Patient Name <button>{FaSort({})}</button></p>
                        <p>Patient DOB <button>{FaSort({})}</button></p>
                        <p>Patient Phone Number <button>{FaSort({})}</button></p>
                        <p>Medication <button>{FaSort({})}</button></p>
                        <p>Status <button>{FaSort({})}</button></p>
                        <p>Completed By <button>{FaSort({})}</button></p>
                        <p>Completed At <button>{FaSort({})}</button></p>
                        <p>Action</p>
                    </div>
                    <div className='table-body'>
                        {transfersSent.map((transfer: any, index: number) => {
                            return (
                                <div className="table-row" key={transfer.id}>
                                    <p>{index + 1}</p>
                                    <p>{formatDate(transfer.created_at).formattedDate}</p>
                                    <p>{`${transfer.requester.first_name} ${transfer.requester.last_name}`}</p>
                                    <p>{transfer.from_pharmacy.name} {`(#${transfer.from_pharmacy.id})`}</p>
                                    <p>{transfer.to_pharmacy.name} {`(#${transfer.to_pharmacy.id})`}</p>
                                    <p>{`${transfer.patient_first_name} ${transfer.patient_last_name}`}</p>
                                    <p>{formatDate(transfer.patient_dob).formattedDate}</p>
                                    <p>{transfer.patient_phone_number}</p>
                                    <p>{transfer.medication_name}</p>
                                    <p style={{ backgroundColor: getStatusColor(transfer.transfer_status) }}>{transfer.transfer_status}</p>
                                    <p>{`${transfer?.completer?.first_name} ${transfer?.completer?.last_name}` || 'N/A'}</p>
                                    <p>{formatDate(transfer?.completed_at).formattedDate || 'N/A'}</p>
                                    <p>
                                        <button onClick={() => dispatch(setTransferID(transfer.id))} className='viewBtn'>View</button>
                                        <button className='moreBtn' onClick={() => {
                                            setToggleOptionBox((prevToggle) => !prevToggle)
                                        }}>{IoMdMore({})}</button>
                                    </p>  
                                    <div className='optionBox' style={{ display: toggleOptionBox ? "block" : "none" }}>
                                        <button onClick={() => navigate(`/edit_transfer/${transfer.id}`)}>{CiEdit({})} Edit</button>
                                        <button onClick={() => navigate(`/delete_transfer/${transfer.id}`)}>{IoTrashSharp({})} Delete</button>
                                    </div>        
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
            <h3 style={{ margin: "1rem 0 0 1rem" }}>Transfer Requests Recieved</h3>
            <div className='transfer-requests-recieved'>
                <div className='table'>
                    <div className='table-header'>
                        <p># <button>{FaSort({})}</button></p>
                        <p>Date <button>{FaSort({})}</button></p>
                        <p>Request By <button>{FaSort({})}</button></p>
                        <p>From Pharmacy <button>{FaSort({})}</button></p>
                        <p>To Pharmacy <button>{FaSort({})}</button></p>
                        <p>Patient Name <button>{FaSort({})}</button></p>
                        <p>Patient DOB <button>{FaSort({})}</button></p>
                        <p>Patient Phone Number <button>{FaSort({})}</button></p>
                        <p>Medication <button>{FaSort({})}</button></p>
                        <p>Status <button>{FaSort({})}</button></p>
                        <p>Completed By <button>{FaSort({})}</button></p>
                        <p>Completed At <button>{FaSort({})}</button></p>
                        <p>Action</p>
                    </div>
                    <div className='table-body'>
                        {transfersRecieved.map((transfer: any, index: number) => {
                            return (
                                <div className="table-row" key={transfer.id}>
                                    <p>{index + 1}</p>
                                    <p>{formatDate(transfer.created_at).formattedDate}</p>
                                    <p>{`${transfer.requester.first_name} ${transfer.requester.last_name}`}</p>
                                    <p>{transfer.from_pharmacy.name} {`(#${transfer.from_pharmacy.id})`}</p>
                                    <p>{transfer.to_pharmacy.name} {`(#${transfer.to_pharmacy.id})`}</p>
                                    <p>{`${transfer.patient_first_name} ${transfer.patient_last_name}`}</p>
                                    <p>{formatDate(transfer.patient_dob).formattedDate}</p>
                                    <p>{transfer.patient_phone_number}</p>
                                    <p>{transfer.medication_name}</p>
                                    <p style={{ backgroundColor: getStatusColor(transfer.transfer_status) }}>{transfer.transfer_status}</p>
                                    <p>{`${transfer?.completer?.first_name} ${transfer?.completer?.last_name}` || 'N/A'}</p>
                                    <p>{formatDate(transfer?.completed_at).formattedDate || 'N/A'}</p>
                                    <p>
                                        <button onClick={() => dispatch(setTransferID(transfer.id))} className='viewBtn'>View</button>
                                        <button className='moreBtn' onClick={() => {
                                            setToggleOptionBox((prevToggle) => !prevToggle)
                                        }}>{IoMdMore({})}</button>
                                    </p>  
                                    <div className='optionBox' style={{ display: toggleOptionBox ? "block" : "none" }}>
                                        <button onClick={() => navigate(`/edit_transfer/${transfer.id}`)}>{CiEdit({})} Edit</button>
                                        <button onClick={() => navigate(`/delete_transfer/${transfer.id}`)}>{IoTrashSharp({})} Delete</button>
                                    </div>        
                                </div>
                            )

                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Transfers