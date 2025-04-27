import { useQuery } from "@tanstack/react-query";

type UseFetchProps = {
    queryKey: string;
    queryFn: () => Promise<any>; // Make sure it's an async function
};

export const useFetch = ({ queryKey, queryFn }: UseFetchProps) => {
    return useQuery({
        queryKey: [queryKey],
        queryFn,
    });
};
