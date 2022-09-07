import * as React from "react";
import type { GetServerSideProps, NextPage } from "next";
import nookies from "nookies";
import { styled } from "@mui/material";
import Button from "@mui/material/Button";
import dayjs from "dayjs";
import { ServerSideProps } from "../../index";
import Index from "../../../components/index/Index";
import {
  addApolloState,
  initializeApollo,
} from "../../../lib/apollo/apollo-client";
import { getHistories } from "../../../lib/apollo/server/getHistories";
import { getUsers } from "../../../lib/apollo/server/getUsers";
import { getAmounts } from "../../../lib/apollo/server/getAmounts";
import InviteUserModal from "../../../components/histories/overview/InviteUserModel";

const YearAndMonthHistoryDetails: NextPage<ServerSideProps> = ({ cookies }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <Wrapper>
      <StyledButton onClick={openModal}>招待</StyledButton>
      <InviteUserModal
        isOpen={isModalOpen}
        close={closeModal}
        onAdd={() => {}}
        cookies={cookies}
      />
    </Wrapper>
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

const Wrapper = styled("div")(
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

const StyledButton = styled(Button)(
  ({ theme }) => `
  color: ${theme.palette.common.white};
`
);

const formattedDate = /^[12]{1}[0-9]{3}-(0[1-9]{1}|1[0-2]{1})$/;

type PathParams = {
  yearAndMonth: string;
};

export default YearAndMonthHistoryDetails;
