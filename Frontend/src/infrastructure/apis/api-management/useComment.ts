import { useAppSelector } from "@application/store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CommentApi, Configuration, CommentAddDTO, CommentUpdateDTO } from "../client";
import { isEmpty } from "lodash";

// Query & mutation keys
const getCommentsQueryKey = "getCommentsQuery";
const addCommentMutationKey = "addCommentMutation";
const deleteCommentMutationKey = "deleteCommentMutation";
const updateCommentMutationKey = "updateCommentMutation";

// Factory to inject token
const getFactory = (token: string | null) => new CommentApi(new Configuration({ accessToken: token ?? "" }));

// GET paginated comments by torrent ID
export const useGetComments = (torrentId: string, page: number, pageSize: number) => {
    const { token } = useAppSelector(x => x.profileReducer);

    return {
        ...useQuery({
            queryKey: [getCommentsQueryKey, token, torrentId, page, pageSize],
            queryFn: async () =>
                await getFactory(token).apiCommentGetPageGet({
                    torrentId,
                    page,
                    pageSize,
                }),
            refetchInterval: Infinity,
            refetchOnWindowFocus: false,
            enabled: !isEmpty(torrentId)
        }),
        queryKey: getCommentsQueryKey
    };
};

// POST new comment
export const useAddComment = () => {
    const { token } = useAppSelector(x => x.profileReducer);
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: [addCommentMutationKey, token],
        mutationFn: async (commentAddDTO: CommentAddDTO) =>
            await getFactory(token).apiCommentAddPost({ commentAddDTO }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [getCommentsQueryKey] });
        }
    });
};

// DELETE comment
export const useDeleteComment = () => {
    const { token } = useAppSelector(x => x.profileReducer);
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: [deleteCommentMutationKey, token],
        mutationFn: async (commentId: string) =>
            await getFactory(token).apiCommentDeleteCommentIdDelete({ commentId }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [getCommentsQueryKey] });
        }
    });
};

// PUT update comment
export const useUpdateComment = () => {
    const { token } = useAppSelector(x => x.profileReducer);
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: [updateCommentMutationKey, token],
        mutationFn: async (commentUpdateDTO: CommentUpdateDTO) =>
            await getFactory(token).apiCommentUpdatePut({ commentUpdateDTO }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [getCommentsQueryKey] });
        }
    });
};