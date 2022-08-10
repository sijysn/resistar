import * as React from "react";
import type { GetServerSideProps, NextPage } from "next";
import dayjs from "dayjs";
import Index from "../../components/index/Index";
import { addApolloState, initializeApollo } from "../../lib/apollo-client";
import {
  GET_HISTORIES,
  getHistoriesProps,
  getHistoriesVarsProps,
} from "../../lib/api/getHistories";

const formattedDate = /^[12]{1}[0-9]{3}-(0[1-9]{1}|1[0-2]{1})$/;

type PathParams = {
  yearAndMonth: string;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { yearAndMonth } = context.params as PathParams;
  const currentYear = dayjs(yearAndMonth).format("YYYY");
  const currentMonth = dayjs(yearAndMonth).format("MM");
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

  if (formattedDate.test(yearAndMonth)) {
    return {
      props: { yearAndMonth: dayjs(yearAndMonth).format("YYYY-MM") },
    };
  }
  return {
    notFound: true,
  };
};

type Props = {
  yearAndMonth: string;
};

const YearAndMonthHistory: NextPage<Props> = ({ yearAndMonth }) => {
  return <Index yearAndMonth={yearAndMonth} />;
};

export default YearAndMonthHistory;
