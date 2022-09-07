import {
  getGroupsWhereUserHasBeenInvitedProps,
  getGroupsWhereUserHasBeenInvitedVarsProps,
  GET_GROUPS_WHERE_USER_HAS_BEEN_INVITED,
} from "../../../lib/apollo/api/getGroupsWhereUserHasBeenInvited";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";

export const getGroupsWhereUserHasBeenInvited = async (
  apolloClient: ApolloClient<NormalizedCacheObject>,
  getGroupsWhereUserHasBeenInvitedQueryVars: getGroupsWhereUserHasBeenInvitedVarsProps
) => {
  const result = await apolloClient.query<
    getGroupsWhereUserHasBeenInvitedProps,
    getGroupsWhereUserHasBeenInvitedVarsProps
  >({
    query: GET_GROUPS_WHERE_USER_HAS_BEEN_INVITED,
    variables: getGroupsWhereUserHasBeenInvitedQueryVars,
  });
  return { ...result };
};
