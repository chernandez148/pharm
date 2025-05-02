
const fetchEmployeesByPharmacyID = async (pharmacyID: number) => {
    const response = await fetch(`https://rx-connect-server-l8z6.vercel.app/${pharmacyID}/users`);
    if (!response.ok) {
        throw new Error("Failed to fetch transfers");
    }

    const data = await response.json(); // ✅ Await the JSON

    return {
        users: data.users,
        pagination: data.pagination,
    };

};


export default fetchEmployeesByPharmacyID;
