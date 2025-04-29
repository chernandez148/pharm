// services/patients/getPatientByID.tsx

const fetchPatientsByID = async (patientID: number, token: string) => {
    console.log(patientID, token)
    const response = await fetch(`/patient/${patientID}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch patient data");
    }

    console.log(response)

    const data = await response.json();
    return { patient: data.patient };
};

export default fetchPatientsByID;
