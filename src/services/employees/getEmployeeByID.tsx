// services/employees/fetchEmployeeByID.tsx

const fetchEmployeeByID = async (userID: number, token: string) => {
    const response = await fetch(`https://rx-connect-server-l8z6.vercel.app/users/${userID}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch patient data");
    }

    const data = await response.json();
    return { user: data.user };
};

export default fetchEmployeeByID;
