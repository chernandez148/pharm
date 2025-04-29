import axios from "axios";
import { Prescription, PrescriptionValues } from "../../types/prescriptions";

const postPrescription = async (values: PrescriptionValues): Promise<Prescription> => {
    const response = await axios.post("https://rx-connect-server-l8z6.vercel.app/create_prescription", values);
    return response.data.prescription;
};


export default postPrescription;
