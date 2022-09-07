import {
  getGroupsProps,
  getGroupsVarsProps,
  GET_GROUPS,
} from "../api/getGroups";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";

export const getGroups = async (
  apolloClient: ApolloClient<NormalizedCacheObject>,
  getGroupsQueryVars: getGroupsVarsProps
) => {
  const result = await apolloClient.query<getGroupsProps, getGroupsVarsProps>({
    query: GET_GROUPS,
    variables: getGroupsQueryVars,
  });
  return { ...result };
};
