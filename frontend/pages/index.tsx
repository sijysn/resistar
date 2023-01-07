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
  const year = now.format("YYYY");
  const month = now.format("MM");
  const yearAndMonth = now.format("YYYY-MM");

  const cookies = nookies.get(context);
  const apolloClient = initializeApollo(cookies["jwtToken"]);

  await getHistories(apolloClient, {
    groupID: cookies["groupID"],
    year: year,
    month: month,
  });

  await getUsers(apolloClient, {
    groupID: cookies["groupID"],
  });

  await getAmounts(apolloClient, {
    year: year,
    month: month,
    groupID: cookies["groupID"],
    userID: cookies["userID"],
  });

  return addApolloState(apolloClient, {
    props: {
      yearAndMonth,
      cookies,
    },
  });
};

export type ServerSideProps = {
  yearAndMonth: string;
  cookies: { [key: string]: string };
};

export default Home;
