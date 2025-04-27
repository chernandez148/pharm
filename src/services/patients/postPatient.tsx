import axios from "axios";
import { Patient, PatientValues } from "../../types/patient";

const postPatient = async (values: PatientValues): Promise<Patient> => {
    const response = await axios.post("/create_patient", values);
    return response.data.transfer;
};


export default postPatient;
