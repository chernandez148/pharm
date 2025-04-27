import axios from "axios";
import { Prescription, PrescriptionValues } from "../../types/prescriptions";

const patchPrescriptionByID = async (values: PrescriptionValues, token: string): Promise<Prescription> => {
    if (!token) {
        throw new Error("Token not found");
    }

    try {
        const response = await axios.patch(
            `/prescriptions/${values.id}`,
            values,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data.prescription;
    } catch (error) {
        console.error("Error in PATCH request:", error.response?.data || error.message);
        throw error;  // Rethrow for further handling if needed
    }
};


export default patchPrescriptionByID;
