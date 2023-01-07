import * as React from "react";
import type { GetServerSideProps, NextPage } from "next";
import nookies from "nookies";
import dayjs from "dayjs";
import { ServerSideProps } from "../../index";
import YearAndMonthHistoryDetails from "../../../components/histories/overview/YearAndMonthHistoryDetails";
import {
  addApolloState,
  initializeApollo,
} from "../../../lib/apollo/apollo-client";
import { getAdjustments } from "../../../lib/apollo/server/getAdjustments";
import { getUsers } from "../../../lib/apollo/server/getUsers";

const YearAndMonthHistoryDetailsPage: NextPage<ServerSideProps> = (props) => {
  return <YearAndMonthHistoryDetails {...props} />;
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

  const cookies = nookies.get(context);
  const apolloClient = initializeApollo(cookies["jwtToken"]);

  await getAdjustments(apolloClient, {
    groupID: cookies["groupID"],
    year,
    month,
  });

  await getUsers(apolloClient, {
    groupID: cookies["groupID"],
  });

  return addApolloState(apolloClient, {
    props: {
      yearAndMonth,
      cookies,
    },
  });
};

const formattedDate = /^[12]{1}[0-9]{3}-(0[1-9]{1}|1[0-2]{1})$/;

type PathParams = {
  yearAndMonth: string;
};

export default YearAndMonthHistoryDetailsPage;
