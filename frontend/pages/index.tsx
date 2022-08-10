import * as React from "react";
import type { NextPage } from "next";
import Index from "../components/index/Index";
import dayjs from "dayjs";
import { addApolloState, initializeApollo } from "../lib/apollo-client";
import {
  GET_HISTORIES,
  getHistoriesQueryVars,
  HistoriesProps,
} from "../components/index/History";

export const getServerSideProps = async () => {
  const apolloClient = initializeApollo();

  await apolloClient.query<HistoriesProps>({
    query: GET_HISTORIES,
    variables: getHistoriesQueryVars,
  });

  return addApolloState(apolloClient, {
    props: {},
  });
};

const Home: NextPage = () => {
  const currentYearAndMonth = dayjs().format("YYYY-MM");
  return <Index yearAndMonth={currentYearAndMonth} />;
};

export default Home;
