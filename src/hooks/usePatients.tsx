import { useQuery } from "@tanstack/react-query";
import fetchPatientsByPharmacyID from "../services/transfers/getTransfersByPharmacyID";

export const usePatientsByPharmacy = ({ pharmacyID }: { pharmacyID: number }) => {
    return useQuery({
        queryKey: ["patients", pharmacyID],
        queryFn: () => fetchPatientsByPharmacyID({ pharmacyID }),
        enabled: !!pharmacyID, // only runs if pharmacyId is truthy
    });
};
