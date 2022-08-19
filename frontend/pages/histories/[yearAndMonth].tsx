import * as React from "react";
import type { GetServerSideProps, NextPage } from "next";
import dayjs from "dayjs";
import { ServerSideProps } from "../../pages/index";
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

  const { data: historiesData } = await getHistories(apolloClient, {
    groupID: "1",
    year,
    month,
  });

  const { data: usersData } = await getUsers(apolloClient, {
    groupID: "1",
  });

  const { data: amountsData } = await getAmounts(apolloClient, {
    year,
    month,
    groupID: "1",
    userID: "1",
  });

  return addApolloState(apolloClient, {
    props: {
      yearAndMonth,
      historiesData,
      usersData,
      amountsData,
    },
  });
};

const formattedDate = /^[12]{1}[0-9]{3}-(0[1-9]{1}|1[0-2]{1})$/;

type PathParams = {
  yearAndMonth: string;
};

export default YearAndMonthHistory;
