import React from 'react'
import './TransferSummary.css'
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

type TransferValues = {
    patient_first_name: string;
    patient_last_name: string;
    patient_dob: string;
    patient_phone_number: string;
    medication_name: string;
    to_pharmacy_id: string;
    transfer_status: string;
};

type SelectedPharmacyValues = {
    pharmacy: string
    id: number | null
}

interface TransferSummaryProps {
    values: TransferValues;
    selectedPharmacy: SelectedPharmacyValues
}

const TransferSummary: React.FC<TransferSummaryProps> = ({ values, selectedPharmacy }) => {
    const user = useSelector((state: RootState) => state.auth.user);

    return (
        <div className='TransferSummary'>
            <h2>Transfer Summary</h2>
            <div className='transfer-summary-info'>
                <fieldset>
                    <legend>Patient Info</legend>
                    <label>Patient Name: </label>
                    <p>
                        {`${values.patient_first_name} ${values.patient_last_name}${values.patient_dob ? ` (DOB: ${values.patient_dob})` : ""}`}
                    </p>

                    <label>Patient Phone Number: </label>
                    <p>{values.patient_phone_number}</p>
                </fieldset>

                <fieldset>
                    <legend>Medication</legend>
                    <label>Name: </label>
                    <p>{values.medication_name}</p>
                </fieldset>

                <fieldset>
                    <legend>Transfer Info</legend>

                    <label>Requested By: </label>
                    <p>{user.user.first_name} {user.user.last_name}</p>

                    <label>Transfer From: </label>
                    <p>{selectedPharmacy.pharmacy}</p>

                    <label>Transfer To: </label>
                    <p>{user.pharmacy.name}</p>

                    <label>Transfer Status: </label>
                    <p>{values.transfer_status}</p>
                </fieldset>
            </div>
        </div>
    )
}

export default TransferSummary