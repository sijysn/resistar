import * as React from "react";
import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import nookies from "nookies";
import dayjs from "dayjs";
import { useQuery } from "@apollo/client";
import { styled } from "@mui/material";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { ServerSideProps } from "../../index";
import {
  addApolloState,
  initializeApollo,
} from "../../../lib/apollo/apollo-client";
import { getHistories } from "../../../lib/apollo/server/getHistories";
import { getUsers } from "../../../lib/apollo/server/getUsers";
import { getAmounts } from "../../../lib/apollo/server/getAmounts";
import InviteUserModal from "../../../components/histories/overview/InviteUserModal";
import Header from "../../../components/histories/overview/Header";
import Adjustment from "../../../components/histories/overview/Adjustment";
import Members from "../../../components/histories/overview/Members";
import {
  getUsersProps,
  getUsersVarsProps,
  GET_USERS,
} from "../../../lib/apollo/api/getUsers";

const YearAndMonthHistoryDetails: NextPage<ServerSideProps> = ({
  cookies,
  yearAndMonth,
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const getUsersQueryVars = {
    groupID: cookies["groupID"],
  };
  const { loading, error, data } = useQuery<getUsersProps, getUsersVarsProps>(
    GET_USERS,
    {
      variables: getUsersQueryVars,
      notifyOnNetworkStatusChange: true,
    }
  );

  return (
    <>
      <Overview>
        <Header yearAndMonth={yearAndMonth} handleClick={openModal} />
        <Adjustment />
      </Overview>
      <Members data={data} loading={loading} error={error} />
      <InviteUserModal
        isOpen={isModalOpen}
        close={closeModal}
        onAdd={() => {}}
        cookies={cookies}
      />
    </>
  );
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
      cookies,
    },
  });
};

const Overview = styled("div")(
  ({ theme }) => `
  background-color: ${theme.palette.primary.main};
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  color: #fff;
  padding: 8px;
`
);

const formattedDate = /^[12]{1}[0-9]{3}-(0[1-9]{1}|1[0-2]{1})$/;

type PathParams = {
  yearAndMonth: string;
};

export default YearAndMonthHistoryDetails;
