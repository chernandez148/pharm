// services/transfers/getTransfersByPharmacyID.tsx

const fetchTransfersByPharmacyID = async (pharmacyID: number) => {
    const response = await fetch(`/${pharmacyID}/transfers`);
    if (!response.ok) {
        throw new Error("Failed to fetch transfers");
    }

    const data = await response.json(); // ✅ Await the JSON

    return {
        transfers: data.transfers,
        pagination: data.pagination,
    };

};


export default fetchTransfersByPharmacyID;
