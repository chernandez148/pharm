
const fetchPrescriptionByID = async (prescriptionID: number) => {
    const response = await fetch(`/prescriptions/${prescriptionID}`);
    if (!response.ok) {
        throw new Error("Failed to fetch transfers");
    }

    const data = await response.json(); // ✅ Await the JSON

    return {
        prescription: data.prescription,
        pagination: data.pagination,
    };

};


export default fetchPrescriptionByID;
