import * as React from "react";
import type { GetServerSideProps, NextPage } from "next";
import Index from "../components/index/Index";
import dayjs from "dayjs";
import { addApolloState, initializeApollo } from "../lib/apollo/apollo-client";
import { getHistoriesProps } from "../lib/apollo/api/getHistories";
import {
  getUsersProps,
  getUsersVarsProps,
  GET_USERS,
} from "../lib/apollo/api/getUsers";
import {
  getAmountsProps,
  getAmountsVarsProps,
  GET_AMOUNTS,
} from "../lib/apollo/api/getAmounts";
import { getHistories } from "../lib/apollo/server/getHistories";
import { getUsers } from "../lib/apollo/server/getUsers";
import { getAmounts } from "../lib/apollo/server/getAmounts";

const Home: NextPage<ServerSideProps> = (props) => {
  return <Index {...props} />;
};

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async () => {
  const now = dayjs();
  const currentYear = now.format("YYYY");
  const currentMonth = now.format("MM");
  const currentYearAndMonth = now.format("YYYY-MM");
  const apolloClient = initializeApollo();

  const { data: historiesData } = await getHistories(apolloClient, {
    groupID: "1",
    year: currentYear,
    month: currentMonth,
  });

  const { data: usersData } = await getUsers(apolloClient, {
    groupID: "1",
  });

  const { data: amountsData } = await getAmounts(apolloClient, {
    year: currentYear,
    month: currentMonth,
    groupID: "1",
    userID: "1",
  });

  return addApolloState(apolloClient, {
    props: {
      yearAndMonth: currentYearAndMonth,
      historiesData,
      usersData,
      amountsData,
    },
  });
};

export type ServerSideProps = {
  yearAndMonth: string;
  historiesData: getHistoriesProps;
  usersData: getUsersProps;
  amountsData: getAmountsProps;
};

export default Home;
