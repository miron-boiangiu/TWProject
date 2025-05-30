import { useTableController } from "../Table.controller";
import { useGetUsers, useDeleteUser } from "@infrastructure/apis/api-management";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { usePaginationController } from "../Pagination.controller";
import { useGetInvitations } from "@infrastructure/apis/api-management/useInvitation";

export const useInvitationsTableController = () => {
    const queryClient = useQueryClient(); // Get the query client.
    const { page, pageSize, setPagination } = usePaginationController(); // Get the pagination state.
    const { data, isError, isLoading, queryKey } = useGetInvitations(page, pageSize); // Retrieve the table page from the backend via the query hook.

    const tryReload = useCallback(
        () => queryClient.invalidateQueries({ queryKey: [queryKey] }),
        [queryClient, queryKey]); // Create a callback to try reloading the data for the table via query invalidation.

    const tableController = useTableController(setPagination, data?.response?.pageSize); // Adapt the pagination for the table.

    return { // Return the controller state and actions.
        ...tableController,
        tryReload,
        pagedData: data?.response,
        isError,
        isLoading,
    };
}