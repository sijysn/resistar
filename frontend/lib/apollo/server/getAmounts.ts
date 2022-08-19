import {
  getAmountsProps,
  getAmountsVarsProps,
  GET_AMOUNTS,
} from "../../../lib/apollo/api/getAmounts";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";

export const getAmounts = async (
  apolloClient: ApolloClient<NormalizedCacheObject>,
  getAmountsQueryVars: getAmountsVarsProps
) => {
  const result = await apolloClient.query<getAmountsProps, getAmountsVarsProps>(
    {
      query: GET_AMOUNTS,
      variables: getAmountsQueryVars,
    }
  );
  return { ...result };
};
