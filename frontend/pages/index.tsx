import * as React from "react";
import type { GetServerSideProps, NextPage } from "next";
import nookies from "nookies";
import dayjs from "dayjs";
import Index from "../components/index/Index";
import { addApolloState, initializeApollo } from "../lib/apollo/apollo-client";
import { getHistories } from "../lib/apollo/server/getHistories";
import { getUsers } from "../lib/apollo/server/getUsers";
import { getAmounts } from "../lib/apollo/server/getAmounts";

const Home: NextPage<ServerSideProps> = (props) => {
  return <Index {...props} />;
};

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (
  context
) => {
  const now = dayjs();
  const currentYear = now.format("YYYY");
  const currentMonth = now.format("MM");
  const currentYearAndMonth = now.format("YYYY-MM");

  const cookies = nookies.get(context);
  const apolloClient = initializeApollo();

  await getHistories(apolloClient, {
    groupID: cookies["groupID"],
    year: currentYear,
    month: currentMonth,
  });

  await getUsers(apolloClient, {
    groupID: cookies["groupID"],
  });

  await getAmounts(apolloClient, {
    year: currentYear,
    month: currentMonth,
    groupID: cookies["groupID"],
    userID: cookies["userID"],
  });

  return addApolloState(apolloClient, {
    props: {
      yearAndMonth: currentYearAndMonth,
      cookies,
    },
  });
};

export type ServerSideProps = {
  yearAndMonth: string;
  cookies: { [key: string]: string };
};

export default Home;
