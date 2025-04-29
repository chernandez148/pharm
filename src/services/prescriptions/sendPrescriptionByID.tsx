import axios from "axios";
import { Prescription, PrescriptionValues } from "../../types/prescriptions";

const sendPrescriptionByID = async (values: PrescriptionValues): Promise<Prescription> => {
    const response = await axios.patch(`https://rx-connect-server-l8z6.vercel.app/prescriptions/${values.id}`, values);
    return response.data.prescription;
};


export default sendPrescriptionByID;
