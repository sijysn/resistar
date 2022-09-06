import {
  getGroupsProps,
  getGroupsVarsProps,
  GET_GROUPS_WHERE_USER_HAS_BEEN_INVITED,
} from "../../../lib/apollo/api/getGroupsWhereUserHasBeenInvited";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";

export const getGroupsWhereUserHasBeenInvited = async (
  apolloClient: ApolloClient<NormalizedCacheObject>,
  getGroupsQueryVars: getGroupsVarsProps
) => {
  const result = await apolloClient.query<getGroupsProps, getGroupsVarsProps>({
    query: GET_GROUPS_WHERE_USER_HAS_BEEN_INVITED,
    variables: getGroupsQueryVars,
  });
  return { ...result };
};
