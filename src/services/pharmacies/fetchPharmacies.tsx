import axios from "axios";

const fetchPharmacies = async () => {
    const response = await axios.get("https://rx-connect-server-l8z6.vercel.app/pharmacies");
    return response.data;
};

export default fetchPharmacies