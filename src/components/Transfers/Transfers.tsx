import './Transfer.css'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { formatDate } from '../../utils/dateUtils';
import { Link, useNavigate } from 'react-router-dom';
import { useFetchByID } from '../../hooks/useFetchByID';
import fetchTransfersByPharmacyID from '../../services/transfers/getTransfersByPharmacyID';
import { FaSort } from 'react-icons/fa6';
import { IoMdMore } from 'react-icons/io';
import { useEffect, useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { IoTrashSharp } from 'react-icons/io5';
import { setTransferID } from '../../redux/slices/transferID';
import { FiCheckCircle } from "react-icons/fi";
import { AiOutlinePlus } from "react-icons/ai";
import { FaEye } from "react-icons/fa";
import formatUserRole from '../../utils/formatUserRoles';

function Transfers() {
    const user = useSelector((state: RootState) => state.user.user);
    const [ID, setID] = useState(null)
    const { data: transfersData, isLoading, isError } = useFetchByID({
        queryKey: "transfers",
        queryFn: fetchTransfersByPharmacyID,
        id: user?.pharmacy_id,
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();

    console.log(user)

    const statusColors = {
        pending: '#FFF3B0',      // pastel yellow
        in_progress: '#A0C4FF',  // pastel blue
        completed: '#B9FBC0',    // pastel green
        cancelled: '#FFADAD',    // pastel red/pink
    };

    const getStatusColor = (status: string) => statusColors[status] || '#E0E0E0';

    if (isLoading) return <div>Loading transfers...</div>;
    if (isError) return <div>Error loading transfers.</div>;

    const transfers = transfersData?.transfers || [];
    const transfersSent = transfers.filter((transfer: any) => transfer.to_pharmacy?.id === user?.pharmacy_id);
    const transfersReceived = transfers.filter((transfer: any) => transfer.from_pharmacy?.id === user?.pharmacy_id);

    const renderField = (value: any, fallback: string = 'N/A') => {
        return value ? value : fallback;
    };

    const renderName = (firstName?: string, lastName?: string) => {
        return firstName || lastName ? `${firstName || ''} ${lastName || ''}`.trim() : 'N/A';
    };

    const renderPharmacy = (pharmacy: any) => {
        return pharmacy?.name ? `${pharmacy.name} ${pharmacy.id ? `(#${pharmacy.id})` : ''}` : 'N/A';
    };

    const renderDate = (dateString?: string) => {
        return dateString ? formatDate(dateString).formattedDate : 'N/A';
    };

    return (
        <div className='Transfers'>
            <div className='transfers-header'>
                <h3>Transfer Requests Sent</h3>
                <div className='transfer-action-item'>
                    <button title='New Transfer' onClick={() => navigate(`/new_transfer`)}>
                        {AiOutlinePlus({})}
                    </button>
                    <button disabled={!ID} title='View Transfer' onClick={() => dispatch(setTransferID(ID))}>
                        {FaEye({})}
                    </button>
                    {(formatUserRole(user.role) === "Pharmacist" || formatUserRole(user.role) === "Admin") && (
                        <button disabled={!ID} title='Approve Transfer'>{FiCheckCircle({})}</button>
                    )}
                    <button disabled={!ID} title='Edit Transfer' onClick={() => navigate(`/edit_transfer/${ID}`)}>
                        {CiEdit({})}
                    </button>
                    <button disabled={!ID} title='Delete Transfer' onClick={() => navigate(`/delete_transfer/${ID}`)}>
                        {IoTrashSharp({})}
                    </button>
                </div>
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
                        <p>Patient Phone <button>{FaSort({})}</button></p>
                        <p>Medication <button>{FaSort({})}</button></p>
                        <p>Status <button>{FaSort({})}</button></p>
                        <p>Completed By <button>{FaSort({})}</button></p>
                        <p>Completed At <button>{FaSort({})}</button></p>
                        <p>Select</p>
                    </div>
                    <div className='table-body'>
                        {transfersSent.map((transfer: any, index: number) => (
                            <div className="table-row" key={transfer.id}>
                                <p>{index + 1}</p>
                                <p>{renderDate(transfer.created_at)}</p>
                                <p>{renderName(transfer.requester?.first_name, transfer.requester?.last_name)}</p>
                                <p>{renderPharmacy(transfer.from_pharmacy)}</p>
                                <p>{renderPharmacy(transfer.to_pharmacy)}</p>
                                <p>{renderName(transfer.patient_first_name, transfer.patient_last_name)}</p>
                                <p>{renderDate(transfer.patient_dob)}</p>
                                <p>{renderField(transfer.patient_phone_number)}</p>
                                <p>{renderField(transfer.medication_name)}</p>
                                <p style={{ backgroundColor: getStatusColor(transfer.transfer_status) }}>
                                    {renderField(transfer.transfer_status)}
                                </p>
                                <p>{renderName(transfer.completer?.first_name, transfer.completer?.last_name)}</p>
                                <p>{renderDate(transfer.completed_at)}</p>
                                <p>
                                    <button
                                        className='moreBtn'
                                    >
                                        <input
                                            type='radio'
                                            checked={ID === transfer.id}
                                            onChange={() => setID(transfer.id)}
                                        />
                                    </button>
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <h3 style={{ margin: "1rem 0 0 1rem" }}>Transfer Requests Received</h3>
            <div className='transfer-requests-received'>
                <div className='table'>
                    <div className='table-header'>
                        <p># <button>{FaSort({})}</button></p>
                        <p>Date <button>{FaSort({})}</button></p>
                        <p>Request By <button>{FaSort({})}</button></p>
                        <p>From Pharmacy <button>{FaSort({})}</button></p>
                        <p>To Pharmacy <button>{FaSort({})}</button></p>
                        <p>Patient Name <button>{FaSort({})}</button></p>
                        <p>Patient DOB <button>{FaSort({})}</button></p>
                        <p>Patient Phone <button>{FaSort({})}</button></p>
                        <p>Medication <button>{FaSort({})}</button></p>
                        <p>Status <button>{FaSort({})}</button></p>
                        <p>Completed By <button>{FaSort({})}</button></p>
                        <p>Completed At <button>{FaSort({})}</button></p>
                        <p>Select</p>
                    </div>
                    <div className='table-body'>
                        {transfersReceived.map((transfer: any, index: number) => (
                            <div className="table-row" key={transfer.id}>
                                <p>{index + 1}</p>
                                <p>{renderDate(transfer.created_at)}</p>
                                <p>{renderName(transfer.requester?.first_name, transfer.requester?.last_name)}</p>
                                <p>{renderPharmacy(transfer.from_pharmacy)}</p>
                                <p>{renderPharmacy(transfer.to_pharmacy)}</p>
                                <p>{renderName(transfer.patient_first_name, transfer.patient_last_name)}</p>
                                <p>{renderDate(transfer.patient_dob)}</p>
                                <p>{renderField(transfer.patient_phone_number)}</p>
                                <p>{renderField(transfer.medication_name)}</p>
                                <p style={{ backgroundColor: getStatusColor(transfer.transfer_status) }}>
                                    {renderField(transfer.transfer_status)}
                                </p>
                                <p>{renderName(transfer.completer?.first_name, transfer.completer?.last_name)}</p>
                                <p>{renderDate(transfer.completed_at)}</p>
                                <p>
                                    <button
                                        className='moreBtn'
                                    >
                                        <input
                                            type='radio'
                                            checked={ID === transfer.id}
                                            onChange={() => setID(transfer.id)}
                                        />
                                    </button>
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Transfers;