import { useAppSelector } from "@application/store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Configuration, LikeApi } from "../client";
import { isEmpty } from "lodash";

// Query/mutation keys
const checkLikeQueryKey = "checkLikeQuery";
const addLikeMutationKey = "addLikeMutation";
const removeLikeMutationKey = "removeLikeMutation";

// API factory
const getFactory = (token: string | null) => new LikeApi(new Configuration({ accessToken: token ?? "" }));

// Check if a user liked a specific torrent
export const useCheckLike = (torrentId: string | null) => {
    const { token } = useAppSelector(x => x.profileReducer);

    return {
        ...useQuery({
            queryKey: [checkLikeQueryKey, token, torrentId],
            queryFn: async () =>
                await getFactory(token).apiLikeCheckLikeTorrentIdPost({
                    torrentId: torrentId ?? "",
                }),
            enabled: !isEmpty(torrentId),
            refetchOnWindowFocus: false,
        }),
        queryKey: checkLikeQueryKey
    };
};

// Add a like to a torrent
export const useAddLike = () => {
    const { token } = useAppSelector(x => x.profileReducer);
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: [addLikeMutationKey, token],
        mutationFn: async (torrentId: string) =>
            await getFactory(token).apiLikeAddTorrentIdPost({ torrentId }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [checkLikeQueryKey] });
        }
    });
};

// Remove a like from a torrent
export const useRemoveLike = () => {
    const { token } = useAppSelector(x => x.profileReducer);
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: [removeLikeMutationKey, token],
        mutationFn: async (torrentId: string) =>
            await getFactory(token).apiLikeDeleteTorrentIdDelete({ torrentId }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [checkLikeQueryKey] });
        }
    });
};