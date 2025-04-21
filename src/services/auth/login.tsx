import axios from "axios";

interface LoginValues {
    email: string;
    password: string;
}

const login = async (values: LoginValues) => {
    const response = await axios.post("http://127.0.0.1:5000/login", values);

    console.log(response)
    return response.data;
};

export default login;
