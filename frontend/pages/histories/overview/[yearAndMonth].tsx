import * as React from "react";
import type { GetServerSideProps, NextPage } from "next";
import nookies from "nookies";
import dayjs from "dayjs";
import { useMutation, useQuery } from "@apollo/client";
import { styled } from "@mui/material";
import { ServerSideProps } from "../../index";
import {
  addApolloState,
  initializeApollo,
} from "../../../lib/apollo/apollo-client";
import { getAdjustment } from "../../../lib/apollo/server/getAdjustment";
import { getUsers } from "../../../lib/apollo/server/getUsers";
import InviteUserModal from "../../../components/histories/overview/InviteUserModal";
import Header from "../../../components/histories/overview/Header";
import Adjustment from "../../../components/histories/overview/Adjustment";
import Members from "../../../components/histories/overview/Members";
import {
  getUsersProps,
  getUsersVarsProps,
  GET_USERS,
} from "../../../lib/apollo/api/getUsers";
import {
  logoutGroupProps,
  LOGOUT_GROUP,
} from "../../../lib/apollo/api/logoutGroup";

const YearAndMonthHistoryDetails: NextPage<ServerSideProps> = ({
  cookies,
  yearAndMonth,
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const [message, setMessage] = React.useState("");

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

  const [logoutGroup] = useMutation<logoutGroupProps>(LOGOUT_GROUP);

  const logout = async () => {
    const { data } = await logoutGroup();
    if (!data) {
      setMessage("予期せぬエラーが起こりました");
      return;
    }
    const { message: logoutMessage, success } = data.logoutGroup;
    if (success) {
      window.location.href = "/get-started/landing";
      return;
    }
    if (logoutMessage) {
      setMessage(logoutMessage);
    }
  };

  return (
    <>
      <Overview>
        <Header
          yearAndMonth={yearAndMonth}
          menuItems={[
            { title: "招待", handleClick: openModal },
            { title: "ログアウト", handleClick: logout },
          ]}
        />
        <Adjustment yearAndMonth={yearAndMonth} cookies={cookies} />
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

  await getAdjustment(apolloClient, {
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
