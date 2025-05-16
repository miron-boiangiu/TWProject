import { useAppSelector } from "@application/store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Configuration, FeedbackApi } from "../client";
import type { FeedbackAddDTO } from "../client";
import { isNil } from "lodash";

// Query/mutation keys
const feedbackListQueryKey = "feedbackListQuery";
const addFeedbackMutationKey = "addFeedbackMutation";

// API factory
const getFactory = (token: string | null) =>
  new FeedbackApi(new Configuration({ accessToken: token ?? "" }));

// Get paged feedback data
export const useGetFeedback = (page: number = 1, pageSize: number = 10) => {
  const { token } = useAppSelector(x => x.profileReducer);

  return {
    ...useQuery({
      queryKey: [feedbackListQueryKey, token, page, pageSize],
      queryFn: async () =>
        await getFactory(token).apiFeedbackGetPageGet({ page, pageSize }),
      enabled: !isNil(token),
      refetchOnWindowFocus: false,
    }),
    queryKey: feedbackListQueryKey,
  };
};

// Submit feedback
export const useAddFeedback = () => {
  const { token } = useAppSelector(x => x.profileReducer);
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [addFeedbackMutationKey, token],
    mutationFn: async (feedback: FeedbackAddDTO) =>
      await getFactory(token).apiFeedbackAddPost({ feedbackAddDTO: feedback }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [feedbackListQueryKey] });
    },
  });
};
