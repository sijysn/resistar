import * as React from "react";
import type { GetServerSideProps, NextPage } from "next";
import dayjs from "dayjs";
import Index from "../../components/index/Index";

const formattedDate = /^[12]{1}[0-9]{3}-(0[1-9]{1}|1[0-2]{1})$/;

type PathParams = {
  yearAndMonth: string;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { yearAndMonth } = context.params as PathParams;
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
