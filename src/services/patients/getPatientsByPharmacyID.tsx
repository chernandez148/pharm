// services/transfers/getTransfersByPharmacyID.tsx

const fetchPatientsByPharmacyID = async (pharmacyID: number) => {
    const response = await fetch(`https://rx-connect-server-l8z6.vercel.app/${pharmacyID}/patients`);
    if (!response.ok) {
        throw new Error("Failed to fetch transfers");
    }

    const data = await response.json(); // ✅ Await the JSON

    return {
        patients: data.patients,
        pagination: data.pagination,
    };

};


export default fetchPatientsByPharmacyID;
