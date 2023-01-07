import * as React from "react";
import dayjs from "dayjs";
import { useMutation, useQuery, NetworkStatus } from "@apollo/client";
import { styled } from "@mui/material";
import { ServerSideProps } from "../../../pages/index";
import InviteUserModal from "../../../components/histories/overview/InviteUserModal";
import Header from "../../../components/histories/overview/Header";
import Adjustments from "../../../components/histories/overview/Adjustments";
import Members from "../../../components/histories/overview/Members";
import {
  getUsersProps,
  getUsersVarsProps,
  GET_USERS,
} from "../../../lib/apollo/api/getUsers";
import {
  getAdjustmentsProps,
  getAdjustmentsVarsProps,
  GET_ADJUSTMENTS,
} from "../../../lib/apollo/api/getAdjustments";
import {
  logoutGroupProps,
  LOGOUT_GROUP,
} from "../../../lib/apollo/api/logoutGroup";

const YearAndMonthHistoryDetails: React.FC<ServerSideProps> = ({
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
  const {
    loading: usersLoading,
    error: usersError,
    data: usersData,
  } = useQuery<getUsersProps, getUsersVarsProps>(GET_USERS, {
    variables: getUsersQueryVars,
    notifyOnNetworkStatusChange: true,
  });

  const year = dayjs(yearAndMonth).format("YYYY");
  const month = dayjs(yearAndMonth).format("M");
  const getAdjustmentsQueryVars = {
    groupID: cookies["groupID"],
    year,
    month,
  };
  const {
    loading: adjustmentsLoading,
    error: adjustmentsError,
    data: adjustmentsData,
    networkStatus: getAdjustmentsNetworkStatus,
  } = useQuery<getAdjustmentsProps, getAdjustmentsVarsProps>(GET_ADJUSTMENTS, {
    variables: getAdjustmentsQueryVars,
    notifyOnNetworkStatusChange: true,
  });
  const loadingMoreAdjustments =
    getAdjustmentsNetworkStatus === NetworkStatus.fetchMore;

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
        <Adjustments
          data={adjustmentsData}
          loading={adjustmentsLoading || loadingMoreAdjustments}
          error={adjustmentsError}
        />
      </Overview>
      <Members data={usersData} loading={usersLoading} error={usersError} />
      <InviteUserModal
        isOpen={isModalOpen}
        close={closeModal}
        onAdd={() => {}}
        cookies={cookies}
      />
    </>
  );
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

export default YearAndMonthHistoryDetails;
