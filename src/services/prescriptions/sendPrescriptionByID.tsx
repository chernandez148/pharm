import axios from "axios";
import { Prescription, PrescriptionValues } from "../../types/prescriptions";

const sendPrescriptionByID = async (values: PrescriptionValues): Promise<Prescription> => {
    const response = await axios.patch(`/prescriptions/${values.id}`, values);
    return response.data.prescription;
};


export default sendPrescriptionByID;
