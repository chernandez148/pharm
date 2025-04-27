import { useQuery } from "@tanstack/react-query";

type UseFetchByIDProps = {
    queryKey: string;
    queryFn: (id: number, token?: string) => Promise<any>;
    id: number;
    token?: string;
};

export const useFetchByID = ({ queryKey, queryFn, id, token }: UseFetchByIDProps) => {
    return useQuery({
        queryKey: [queryKey, id],
        queryFn: () => queryFn(id, token),
        enabled: !!id,
    });
};
