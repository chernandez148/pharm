import axios from "axios";
import { Employee, EmployeeValues } from "../../types/employees";

const patchEmployeeByID = async (values: EmployeeValues, token: string): Promise<Employee> => {
    if (!token) {
        throw new Error("Token not found");
    }

    try {
        const response = await axios.patch(
            `https://rx-connect-server-l8z6.vercel.app/users/${values.id}`,
            values,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data.user;
    } catch (error) {
        console.error("Error in PATCH request:", error.response?.data || error.message);
        throw error;  // Rethrow for further handling if needed
    }
};


export default patchEmployeeByID;
