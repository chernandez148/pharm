import axios from "axios";
import { Prescription, PrescriptionValues } from "../../types/prescriptions";

const postPrescription = async (values: PrescriptionValues): Promise<Prescription> => {
    const response = await axios.post("/create_prescription", values);
    return response.data.prescription;
};


export default postPrescription;
