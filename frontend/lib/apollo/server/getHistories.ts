import {
  getHistoriesProps,
  getHistoriesVarsProps,
  GET_HISTORIES,
} from "../api/getHistories";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";

export const getHistories = async (
  apolloClient: ApolloClient<NormalizedCacheObject>,
  getHistoriesQueryVars: getHistoriesVarsProps
) => {
  const result = await apolloClient.query<
    getHistoriesProps,
    getHistoriesVarsProps
  >({
    query: GET_HISTORIES,
    variables: getHistoriesQueryVars,
  });
  return { ...result };
};
