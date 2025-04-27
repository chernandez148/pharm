import { useMutation, useQueryClient, QueryKey } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const usePatchMutation = <TData extends { id: number | string }, TVariables>(
    queryKey: QueryKey,
    mutationFn: (variables: TVariables) => Promise<TData>
) => {
    const queryClient = useQueryClient();

    return useMutation<TData, unknown, TVariables>({
        mutationFn,
        onSuccess: (updatedItem) => {
            queryClient.setQueryData<TData[]>(queryKey, (old = []) =>
                old.map(item => item.id === updatedItem.id ? updatedItem : item)
            );
            toast.success("Updated successfully!");
        },
        onError: (error) => {
            console.error("Mutation error:", error);
            toast.error("Something went wrong");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });
};