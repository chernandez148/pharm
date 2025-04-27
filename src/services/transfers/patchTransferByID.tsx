import axios from "axios";
import { Transfer, TransferValues } from "../../types/transfer";

const patchTransferByID = async (values: TransferValues): Promise<Transfer> => {
    const response = await axios.patch(`/transfers/${values.id}`, values);
    return response.data.transfer;
};


export default patchTransferByID;
