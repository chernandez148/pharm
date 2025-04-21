import { useMutation, useQueryClient, QueryKey } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const usePostMutation = <TData, TVariables>(
    queryKey: QueryKey,
    mutationFn: (variables: TVariables) => Promise<TData>
) => {
    const queryClient = useQueryClient();

    return useMutation<TData, unknown, TVariables>({
        mutationFn,
        onSuccess: (data) => {
            queryClient.setQueryData<TData[]>(queryKey, (old = []) => [data, ...(old || [])]);
            toast.success("Created successfully!");
        },
        onError: () => toast.error("Something went wrong"),
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });
};
