import {
  getAdjustmentProps,
  getAdjustmentVarsProps,
  GET_ADJUSTMENT,
} from "../../../lib/apollo/api/getAdjustment";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";

export const getAdjustment = async (
  apolloClient: ApolloClient<NormalizedCacheObject>,
  getAdjustmentQueryVars: getAdjustmentVarsProps
) => {
  const result = await apolloClient.query<
    getAdjustmentProps,
    getAdjustmentVarsProps
  >({
    query: GET_ADJUSTMENT,
    variables: getAdjustmentQueryVars,
  });
  return { ...result };
};
