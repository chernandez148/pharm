import axios from "axios";

interface LoginValues {
    email: string;
    password: string;
}

const login = async (values: LoginValues) => {
    const response = await axios.post("https://rx-connect-server-l8z6.vercel.app/login", values);

    return {
        user: response.data.user,
        access_token: response.data.access_token
    };
};

export default login;
