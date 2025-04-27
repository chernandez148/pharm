import axios from "axios";
import { Patient, PatientValues } from "../../types/patient";

const patchPatientByID = async (values: PatientValues, token: string): Promise<Patient> => {
    if (!token) {
        throw new Error("Token not found");
    }

    try {
        const response = await axios.patch(
            `/patient/${values.id}`,
            values,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data.patient;
    } catch (error) {
        console.error("Error in PATCH request:", error.response?.data || error.message);
        throw error;  // Rethrow for further handling if needed
    }
};


export default patchPatientByID;
