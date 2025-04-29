import axios from "axios";
import { Patient, PatientValues } from "../../types/patient";

const postPatient = async (values: PatientValues): Promise<Patient> => {
    const response = await axios.post("https://rx-connect-server-l8z6.vercel.app/create_patient", values);
    return response.data.transfer;
};


export default postPatient;
