import { useQuery } from "@tanstack/react-query";
import fetchPharmacies from "../services/pharmacies/fetchPharmacies";

export const usePharmacies = () => {
    return useQuery({
        queryKey: ["pharmacies"],
        queryFn: fetchPharmacies,
    });
};