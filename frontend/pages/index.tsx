import * as React from "react";
import type { GetServerSideProps, NextPage } from "next";
import { parseCookies } from "nookies";
import dayjs from "dayjs";
import Index from "../components/index/Index";
import { addApolloState, initializeApollo } from "../lib/apollo/apollo-client";
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

  await getHistories(apolloClient, {
    groupID: "1",
    year: currentYear,
    month: currentMonth,
  });

  await getUsers(apolloClient, {
    groupID: "1",
  });

  const cookies = parseCookies();
  await getAmounts(apolloClient, {
    year: currentYear,
    month: currentMonth,
    groupID: "1",
    userID: cookies["userID"],
  });

  return addApolloState(apolloClient, {
    props: {
      yearAndMonth: currentYearAndMonth,
    },
  });
};

export type ServerSideProps = {
  yearAndMonth: string;
};

export default Home;
