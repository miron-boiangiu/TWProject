import { useAppSelector } from "@application/store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Configuration, InvitationApi } from "../client";
import { isEmpty, isNil } from "lodash";

// Query keys
const invitationPageQueryKey = "invitationPageQuery";
const invitationByIdQueryKey = "invitationByIdQuery";
const generateInvitationQueryKey = "generateInvitationQuery";

// API factory
const getFactory = (token: string | null) =>
  new InvitationApi(new Configuration({ accessToken: token ?? "" }));

// Get a paginated list of invitations
export const useGetInvitations = (page: number = 1, pageSize: number = 10) => {
  const { token } = useAppSelector(x => x.profileReducer);

  return {
    ...useQuery({
      queryKey: [invitationPageQueryKey, token, page, pageSize],
      queryFn: async () =>
        await getFactory(token).apiInvitationGetPageGet({ page, pageSize }),
      enabled: !isEmpty(token),
      refetchOnWindowFocus: false,
    }),
    queryKey: invitationPageQueryKey,
  };
};

// Get a single invitation by ID
export const useGetInvitationById = (invitationId: string | null) => {
  const { token } = useAppSelector(x => x.profileReducer);

  return {
    ...useQuery({
      queryKey: [invitationByIdQueryKey, token, invitationId],
      queryFn: async () =>
        await getFactory(token).apiInvitationGetInvitationIdGet({
          invitationId: invitationId ?? "",
        }),
      enabled: !isNil(invitationId) && !isEmpty(token),
      refetchOnWindowFocus: false,
    }),
    queryKey: invitationByIdQueryKey,
  };
};

// Generate a new invitation code
export const useGenerateInvitation = () => {
  const { token } = useAppSelector(x => x.profileReducer);
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [generateInvitationQueryKey, token],
    mutationFn: async () => {
      const result = await getFactory(token).apiInvitationGenerateGet();

      // Invalidate other queries if needed (e.g., list of invitations)
      await queryClient.invalidateQueries({ queryKey: ["invitationPageQuery"] });

      return result;
    },
  });
};