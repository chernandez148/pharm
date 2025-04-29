
const fetchPrescriptionByID = async (prescriptionID: number) => {
    const response = await fetch(`https://rx-connect-server-l8z6.vercel.app/prescriptions/${prescriptionID}`);
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
