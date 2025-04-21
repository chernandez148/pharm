import { useQuery } from "@tanstack/react-query";
import fetchTransfersByPharmacyID from "../services/transfers/getTransfersByPharmacyID";

export const useTransfersByPharmacy = ({ pharmacyID }: { pharmacyID: number }) => {
    return useQuery({
        queryKey: ["transfers", pharmacyID],
        queryFn: () => fetchTransfersByPharmacyID({ pharmacyID }),
        enabled: !!pharmacyID, // only runs if pharmacyId is truthy
    });
};
