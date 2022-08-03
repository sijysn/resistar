import * as React from "react";
import type { NextPage } from "next";
import Index from "../components/index/Index";
import dayjs from "dayjs";

const Home: NextPage = () => {
  const currentYearAndMonth = dayjs().format("YYYY-MM");
  return <Index yearAndMonth={currentYearAndMonth} />;
};

export default Home;
