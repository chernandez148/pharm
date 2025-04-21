import axios from "axios";
import { Transfer, TransferValues } from "../../types/transfer";

const postTransfer = async (values: TransferValues): Promise<Transfer> => {
    const response = await axios.post("/create_transfer", values);
    return response.data.transfer;
};


export default postTransfer;
