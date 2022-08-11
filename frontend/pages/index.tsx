import * as React from "react";
import type { NextPage } from "next";
import Index from "../components/index/Index";
import dayjs from "dayjs";
import { addApolloState, initializeApollo } from "../lib/apollo-client";
import {
  GET_HISTORIES,
  getHistoriesProps,
  getHistoriesVarsProps,
} from "../lib/api/getHistories";
import {
  GET_USERS,
  getUsersProps,
  getUsersVarsProps,
} from "../lib/api/getUsers";

export const getServerSideProps = async () => {
  const currentYear = dayjs().format("YYYY");
  const currentMonth = dayjs().format("MM");
  const apolloClient = initializeApollo();

  const getHistoriesQueryVars = {
    groupID: "1",
    year: currentYear,
    month: currentMonth,
  };
  await apolloClient.query<getHistoriesProps, getHistoriesVarsProps>({
    query: GET_HISTORIES,
    variables: getHistoriesQueryVars,
  });

  const getUsersQueryVars = {
    groupID: "1",
  };
  await apolloClient.query<getUsersProps, getUsersVarsProps>({
    query: GET_USERS,
    variables: getUsersQueryVars,
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
