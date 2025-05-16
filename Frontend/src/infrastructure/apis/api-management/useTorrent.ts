import { useAppSelector } from "@application/store";
import { Configuration, TorrentApi } from "../client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isEmpty } from "lodash";

// Query/Mutation keys
const getTorrentsQueryKey = "getTorrentsQuery";
const getTorrentQueryKey = "getTorrentQuery";
const addTorrentMutationKey = "addTorrentMutation";
const deleteTorrentMutationKey = "deleteTorrentMutation";

// Factory that sets token
const getFactory = (token: string | null) => new TorrentApi(new Configuration({ accessToken: token ?? "" }));

export const useGetTorrents = (page: number, pageSize: number, search: string = "") => {
    const { token } = useAppSelector(x => x.profileReducer);

    return {
        ...useQuery({
            queryKey: [getTorrentsQueryKey, token, page, pageSize, search],
            queryFn: async () =>
                await getFactory(token).apiTorrentGetPageGet({ page, pageSize, search }),
            refetchInterval: Infinity,
            refetchOnWindowFocus: false,
        }),
        queryKey: getTorrentsQueryKey
    };
};

export const useGetTorrent = (id: string | null) => {
    const { token } = useAppSelector(x => x.profileReducer);

    return {
        ...useQuery({
            queryKey: [getTorrentQueryKey, token, id],
            queryFn: async () =>
                await getFactory(token).apiTorrentGetIdGet({ id: id ?? "" }),
            refetchInterval: Infinity,
            refetchOnWindowFocus: false,
            enabled: !isEmpty(id)
        }),
        queryKey: getTorrentQueryKey
    };
};

export const useAddTorrent = () => {
    const { token } = useAppSelector(x => x.profileReducer);
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: [addTorrentMutationKey, token],
        mutationFn: async (formData: { file: Blob; description: string }) =>
            await getFactory(token).apiTorrentAddPost({
                file: formData.file,
                description: formData.description
            }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [getTorrentsQueryKey] });
        }
    });
};

export const useDeleteTorrent = () => {
    const { token } = useAppSelector(x => x.profileReducer);
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: [deleteTorrentMutationKey, token],
        mutationFn: async (id: string) =>
            await getFactory(token).apiTorrentDeleteIdDelete({ id }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [getTorrentsQueryKey] });
            await queryClient.invalidateQueries({ queryKey: [getTorrentQueryKey] });
        }
    });
};