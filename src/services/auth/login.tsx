import axios from "axios";

interface LoginValues {
    email: string;
    password: string;
}

const login = async (values: LoginValues) => {
    const response = await axios.post("http://127.0.0.1:5000/login", values);

    return {
        user: response.data.user,
        access_token: response.data.access_token
    };
};

export default login;
