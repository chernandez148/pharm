// services/transfers/getPrescriptionsByPharmacyID.tsx

const fetchPrescriptionsByPharmacyID = async (pharmacyID: number) => {
    const response = await fetch(`https://rx-connect-server-l8z6.vercel.app/${pharmacyID}/prescriptions`);
    if (!response.ok) {
        throw new Error("Failed to fetch transfers");
    }

    const data = await response.json(); // ✅ Await the JSON

    return {
        prescriptions: data.prescriptions,
        pagination: data.pagination,
    };

};


export default fetchPrescriptionsByPharmacyID;
