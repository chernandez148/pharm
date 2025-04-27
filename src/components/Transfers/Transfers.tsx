import './Transfer.css'
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { formatDate } from '../../utils/dateUtils';
import { Link, useNavigate } from 'react-router-dom';
import { useFetchByID } from '../../hooks/useFetchByID';
import fetchTransfersByPharmacyID from '../../services/transfers/getTransfersByPharmacyID';

function Transfers() {
    const user = useSelector((state: RootState) => state.user.user);
    const { data: transfersData, isLoading, isError } = useFetchByID({
        queryKey: "transfers",
        queryFn: fetchTransfersByPharmacyID,
        id: user?.pharmacy_id,
    });
    const navigate = useNavigate();

    const transfersSent = transfersData?.transfers.filter((transfer: any) => transfer.to_pharmacy.id === user.pharmacy_id);
    const transfersRecieved = transfersData?.transfers.filter((transfer: any) => transfer.from_pharmacy.id === user.pharmacy_id);;

    const statusColors = {
        pending: '#FFF3B0',      // pastel yellow
        in_progress: '#A0C4FF',  // pastel blue
        completed: '#B9FBC0',    // pastel green
        cancelled: '#FFADAD',    // pastel red/pink
    };

    const getStatusColor = (status: string) => statusColors[status] || '#E0E0E0'; // light gray as fallback      

    if (isLoading) return <div>Loading transfers...</div>;
    if (isError) return <div>Error loading transfers.</div>;

    console.log(user)

    return (
        <div className='Transfers'>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span></span>
                <h3>Transfer Requests Sent</h3>
                <Link to="/new_transfer">+ Add</Link>
            </div>
            <div className='transfer-requests-sent'>
                <div className='table'>
                    <div className='table-header'>
                        <p style={{ width: "40px", textAlign: "center" }}></p>
                        <p>Date</p>
                        <p>Request By</p>
                        <p>From Pharmacy</p>
                        <p>To Pharmacy</p>
                        <p>Patient Name</p>
                        <p>Patient DOB</p>
                        <p>Patient Phone Number</p>
                        <p>Medication</p>
                        <p>Status</p>
                        <p>Completed By</p>
                        <p>Completed At</p>
                    </div>
                    <div className='table-body'>
                        {transfersSent.map((transfer: any) => {
                            return (
                                <div className="table-row" key={transfer.id}>
                                    <button style={{ width: "58px", textAlign: "center", padding: ".5rem" }} onClick={() => navigate(`/edit_transfer/${transfer.id}`)}>Edit</button>
                                    <p>{formatDate(transfer.created_at)}</p>
                                    <p>{`${transfer.requester.first_name} ${transfer.requester.last_name}`}</p>
                                    <p>{transfer.from_pharmacy.name}</p>
                                    <p>{transfer.to_pharmacy.name}</p>
                                    <p>{`${transfer.patient_first_name} ${transfer.patient_last_name}`}</p>
                                    <p>{formatDate(transfer.patient_dob)}</p>
                                    <p>{transfer.patient_phone_number}</p>
                                    <p>{transfer.medication_name}</p>
                                    <p style={{ backgroundColor: getStatusColor(transfer.transfer_status) }}>{transfer.transfer_status}</p>
                                    <p>{transfer.completed_by || 'N/A'}</p>
                                    <p>{transfer.completed_at || 'N/A'}</p>
                                </div>
                            )

                        })}
                    </div>
                </div>
            </div>
            <h3 style={{ marginTop: "1rem" }}>Transfer Requests Recieved</h3>
            <div className='transfer-requests-recieved'>
                <div className='table'>
                    <div className='table-header'>
                        <p style={{ width: "58px", textAlign: "center", padding: ".5rem" }}></p>
                        <p>Date</p>
                        <p>Request By</p>
                        <p>From Pharmacy</p>
                        <p>To Pharmacy</p>
                        <p>Patient Name</p>
                        <p>Patient DOB</p>
                        <p>Patient Phone Number</p>
                        <p>Medication</p>
                        <p>Status</p>
                        <p>Completed By</p>
                        <p>Completed At</p>
                    </div>
                    <div className='table-body'>
                        {transfersRecieved.map((transfer: any) => {
                            return (
                                <div className="table-row" key={transfer.id}>
                                    <p style={{ width: "58px", textAlign: "center" }}></p>
                                    <p>{formatDate(transfer.created_at)}</p>
                                    <p>{`${transfer.requester.first_name} ${transfer.requester.last_name}`}</p>
                                    <p>{transfer.from_pharmacy.name}</p>
                                    <p>{transfer.to_pharmacy.name}</p>
                                    <p>{`${transfer.patient_first_name} ${transfer.patient_last_name}`}</p>
                                    <p>{formatDate(transfer.patient_dob)}</p>
                                    <p>{transfer.patient_phone_number}</p>
                                    <p>{transfer.medication_name}</p>
                                    <p style={{ backgroundColor: getStatusColor(transfer.transfer_status) }}>{transfer.transfer_status}</p>
                                    <p>{transfer.completed_by || 'N/A'}</p>
                                    <p>{transfer.completed_at || 'N/A'}</p>
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