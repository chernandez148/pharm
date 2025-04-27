export type Prescription = {
    id: number;
    patient_id?: number;
    mediaction?: string;
    dosage?: string;
    quantity?: number;
    pharmacy_ids?: number[]
}

export type PrescriptionValues = {
    id?: number;
    patient_id?: number;
    mediaction?: string;
    dosage?: string;
    quantity?: number;
    pharmacy_ids?: number[]
}