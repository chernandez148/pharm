import axios from "axios";

const fetchPharmacies = async () => {
    const response = await axios.get("http://127.0.0.1:5000/pharmacies");
    return response.data;
};

export default fetchPharmacies