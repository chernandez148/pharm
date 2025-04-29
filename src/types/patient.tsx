export type Patient = {
    id: number;
    first_name?: string;
    last_name?: string;
    dob?: string;
    sex?: string;
    phone_number: string;
    email: string;
    address: string;
    pharmacy_ids?: number[]
}

export type PatientValues = {
    id?: number;
    first_name?: string;
    last_name?: string;
    dob?: string;
    sex?: string;
    phone_number?: string;
    email?: string;
    address?: string;
    pharmacy_ids?: number[]
}