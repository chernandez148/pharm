// types/transfer.ts
export type Transfer = {
    id: number;
    from_pharmacy_id: number;
    to_pharmacy_id: number;
    medication_name: string;
    transfer_status: string;
    // add the rest of your Transfer shape
};

// types/forms.ts
export type TransferValues = {
    id?: number,
    patient_first_name: string;
    patient_last_name: string;
    patient_dob: string;
    patient_phone_number: string;
    medication_name: string;
    requested_by: string;
    from_pharmacy_id: number | null;
    to_pharmacy_id: number;
    transfer_status: string;
};
