import * as React from "react";
import type { GetServerSideProps, NextPage } from "next";
import nookies from "nookies";
import dayjs from "dayjs";
import { ServerSideProps } from "../index";
import Index from "../../components/index/Index";
import {
  addApolloState,
  initializeApollo,
} from "../../lib/apollo/apollo-client";
import { getHistories } from "../../lib/apollo/server/getHistories";
import { getUsers } from "../../lib/apollo/server/getUsers";
import { getAmounts } from "../../lib/apollo/server/getAmounts";

const YearAndMonthHistory: NextPage<ServerSideProps> = (props) => {
  return <Index {...props} />;
};

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (
  context
) => {
  const { yearAndMonth: param } = context.params as PathParams;
  if (!formattedDate.test(param)) {
    return {
      notFound: true,
    };
  }

  const datetime = dayjs(param);
  const year = datetime.format("YYYY");
  const month = datetime.format("MM");
  const yearAndMonth = datetime.format("YYYY-MM");
  const apolloClient = initializeApollo();

  const cookies = nookies.get(context);

  await getHistories(apolloClient, {
    groupID: cookies["groupID"],
    year,
    month,
  });

  await getUsers(apolloClient, {
    groupID: cookies["groupID"],
  });

  await getAmounts(apolloClient, {
    year,
    month,
    groupID: cookies["groupID"],
    userID: cookies["userID"],
  });

  return addApolloState(apolloClient, {
    props: {
      yearAndMonth,
    },
  });
};

const formattedDate = /^[12]{1}[0-9]{3}-(0[1-9]{1}|1[0-2]{1})$/;

type PathParams = {
  yearAndMonth: string;
};

export default YearAndMonthHistory;
