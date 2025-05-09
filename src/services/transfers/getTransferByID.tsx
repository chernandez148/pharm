// services/transfers/getTransfersByPharmacyID.tsx

const fetchTransfersByID = async (id: number) => {
    const response = await fetch(`https://rx-connect-server-l8z6.vercel.app/transfers/${id}`);
    if (!response.ok) {
        throw new Error("Failed to fetch transfers");
    }

    const data = await response.json(); // ✅ Await the JSON

    return {
        transfer: data.transfer,
        pagination: data.pagination,
    };

};


export default fetchTransfersByID;
