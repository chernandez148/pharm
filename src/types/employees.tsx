export type Employee = {
    id: number;
    first_name?: string;
    last_name?: string;
    username?: string;
    email?: string;
    role?: string;
}

export type EmployeeValues = {
    id?: number;
    first_name?: string;
    last_name?: string;
    username?: string;
    email?: string;
    role?: string;
}

export enum EmployeeRole {
    ADMIN = 'admin',
    PHARMACIST = 'pharmacist',
    TECHNICIAN = 'technician'
  }