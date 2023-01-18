import { getUserProps, getUserVarsProps, GET_USER } from "../api/getUser";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";

export const getUser = async (
  apolloClient: ApolloClient<NormalizedCacheObject>,
  getUserQueryVars: getUserVarsProps
) => {
  const result = await apolloClient.query<getUserProps, getUserVarsProps>({
    query: GET_USER,
    variables: getUserQueryVars,
  });
  return { ...result };
};
