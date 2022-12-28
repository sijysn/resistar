import { getUsersProps, getUsersVarsProps, GET_USERS } from "../api/getUsers";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";

export const getUsers = async (
  apolloClient: ApolloClient<NormalizedCacheObject>,
  getUsersQueryVars: getUsersVarsProps
) => {
  const result = await apolloClient.query<getUsersProps, getUsersVarsProps>({
    query: GET_USERS,
    variables: getUsersQueryVars,
  });
  return { ...result };
};
