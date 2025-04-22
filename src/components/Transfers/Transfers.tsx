import { Link } from 'react-router-dom'
import './Transfer.css'
import { useTransfersByPharmacy } from '../../hooks/useTransfers'
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { formatDate } from '../../utils/dateUtils';
import { usePharmacies } from '../../hooks/usePharmacies';
import SearchForm from '../SearchForm/SearchForm';

function Transfers() {
    const user = useSelector((state: RootState) => state.auth.user);
    const { data: transfersData, isLoading, isError } = useTransfersByPharmacy({ pharmacyID: user.pharmacy.id });
    const { data: pharmaciesData } = usePharmacies();

    const transfersSent = transfersData?.transfers.filter((transfer: any) => transfer.to_pharmacy_id === user.pharmacy.id);
    const transfersRecieved = transfersData?.transfers.filter((transfer: any) => transfer.from_pharmacy_id === user.pharmacy.id);;

    console.log(transfersData?.transfers)

    const pharmacies = pharmaciesData?.pharmacies || [];

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
                <div className='transfers-search'>
                    <SearchForm />
                </div>
                <Link to="/new_transfer">+ Add</Link>
            </div>
            <h2>Transfer Requests Sent</h2>
            <div className='transfer-requests-sent'>
                <div className='table'>
                    <div className='table-header'>
                        <p></p>
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
                            const fromPharmacy = pharmacies.filter((pharmacy: any) => pharmacy.id === transfer.from_pharmacy_id)
                            const toPharmacy = pharmacies.filter((pharmacy: any) => pharmacy.id === transfer.to_pharmacy_id)
                            return (
                                <div className="table-row" key={transfer.id}>
                                    <p>Edit</p>
                                    <p>{formatDate(transfer.created_at)}</p>
                                    <p>{transfer.requested_by}</p>
                                    <p>{fromPharmacy[0].name}</p>
                                    <p>{toPharmacy[0].name}</p>
                                    <p>{`${transfer.patient_first_name} ${transfer.patient_last_name}`}</p>
                                    <p>{transfer.patient_dob}</p>
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
            <h2 style={{ marginTop: "1rem" }}>Transfer Requests Recieved</h2>
            <div className='transfer-requests-recieved'>
                <div className='table'>
                    <div className='table-header'>
                        <p></p>
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
                            const fromPharmacy = pharmacies.filter((pharmacy: any) => pharmacy.id === transfer.from_pharmacy_id)
                            const toPharmacy = pharmacies.filter((pharmacy: any) => pharmacy.id === transfer.to_pharmacy_id)
                            return (
                                <div className="table-row" key={transfer.id}>
                                    <p>Edit</p>
                                    <p>{formatDate(transfer.created_at)}</p>
                                    <p>{transfer.requested_by}</p>
                                    <p>{fromPharmacy[0].name}</p>
                                    <p>{toPharmacy[0].name}</p>
                                    <p>{`${transfer.patient_first_name} ${transfer.patient_last_name}`}</p>
                                    <p>{transfer.patient_dob}</p>
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