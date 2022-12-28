import {
  getAdjustmentsProps,
  getAdjustmentsVarsProps,
  GET_ADJUSTMENTS,
} from "../api/getAdjustment";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";

export const getAdjustments = async (
  apolloClient: ApolloClient<NormalizedCacheObject>,
  getAdjustmentsQueryVars: getAdjustmentsVarsProps
) => {
  const result = await apolloClient.query<getAdjustmentsProps>({
    query: GET_ADJUSTMENTS,
    variables: getAdjustmentsQueryVars,
  });
  return { ...result };
};
