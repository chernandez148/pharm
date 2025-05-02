import React from 'react'
import { Employee, EmployeeValues } from '../../types/employees'
import axios from 'axios';
const postEmployee = async (values: EmployeeValues): Promise<Employee> => {
    const response = await axios.post("https://rx-connect-server-l8z6.vercel.app/create_user", values);
    return response.data.user;}

export default postEmployee