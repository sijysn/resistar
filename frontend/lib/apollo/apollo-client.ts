import { useMemo } from "react";
import {
  ApolloClient,
  InMemoryCache,
  from,
  NormalizedCacheObject,
  gql,
  ApolloLink,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import merge from "deepmerge";
import isEqual from "lodash/isEqual";
import { createUploadLink } from "apollo-upload-client";

const APOLLO_STATE = "__APOLLO_STATE__";

let apolloClient: ApolloClient<NormalizedCacheObject>;

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const httpLink = createUploadLink({
  uri: process.env.NEXT_PUBLIC_API_URL,
  credentials: "include",
}) as unknown;

const getAuthLink = (jwtToken: string) => {
  return setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        "content-type": "application/json",
        Authorization: jwtToken ? `Bearer ${jwtToken}` : "dddd",
      },
    };
  }).concat(httpLink as ApolloLink);
};

const createApolloClient = (jwtToken: string) => {
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: from([errorLink, getAuthLink(jwtToken)]),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            histories: {
              merge(_, incoming) {
                return incoming;
              },
            },
          },
        },
      },
    }),
    typeDefs: gql`
      # graphqlのクエリ内で独自の型を使用する場合はここに定義する
      enum Type {
        DIARY
        TRAVEL
        RENT
        UTILITY
        COMMUNICATION
        FOOD
        OTHERS
      }

      scalar Upload
    `,
  });
};

export const initializeApollo = (
  jwtToken: string,
  initialState?: Partial<unknown>
) => {
  const _apolloClient = apolloClient ?? createApolloClient(jwtToken);
  if (initialState) {
    const existingCache = _apolloClient.extract();

    const data = merge(existingCache, initialState, {
      arrayMerge: (destinationArray, sourceArray) => [
        ...sourceArray,
        ...destinationArray.filter((d) =>
          sourceArray.every((s) => !isEqual(d, s))
        ),
      ],
    }) as NormalizedCacheObject;

    _apolloClient.cache.restore(data);
  }
  if (typeof window === "undefined") {
    return _apolloClient;
  }
  if (!apolloClient) {
    apolloClient = _apolloClient;
  }
  return _apolloClient;
};

export const addApolloState = (
  client: ApolloClient<NormalizedCacheObject>,
  pageProps: any
) => {
  if (pageProps?.props) {
    pageProps.props[APOLLO_STATE] = client.cache.extract();
  }
  return pageProps;
};

export const useApollo = (pageProps: any, jwtToken: string) => {
  const state = pageProps[APOLLO_STATE];
  const store = useMemo(() => initializeApollo(jwtToken, state), [
    jwtToken,
    state,
  ]);
  return store;
};
