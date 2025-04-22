// services/transfers/getTransfersByPharmacyID.tsx

const fetchPatientsByPharmacyID = async ({ pharmacyID }: { pharmacyID: number }) => {
    const response = await fetch(`/${pharmacyID}/patients`);
    if (!response.ok) {
        throw new Error("Failed to fetch transfers");
    }

    const data = await response.json(); // ✅ Await the JSON

    return {
        transfers: data.patients,
        pagination: data.pagination,
    };

};


export default fetchPatientsByPharmacyID;
