import axios from "axios";
import { Transfer, TransferValues } from "../../types/transfer";

const patchTransferByID = async (values: TransferValues): Promise<Transfer> => {
    const response = await axios.patch(`https://rx-connect-server-l8z6.vercel.app/transfers/${values.id}`, values);
    return response.data.transfer;
};


export default patchTransferByID;
