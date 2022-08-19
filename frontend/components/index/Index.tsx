import * as React from "react";
import { useQuery, NetworkStatus } from "@apollo/client";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/material";
import { ServerSideProps } from "../../pages/index";
import History from "./History";
import Overview from "./Overview";
import AddFormModal from "./AddFormModal";
import {
  GET_HISTORIES,
  getHistoriesProps,
  getHistoriesVarsProps,
} from "../../lib/apollo/api/getHistories";
import dayjs from "dayjs";
import {
  GET_AMOUNTS,
  getAmountsProps,
  getAmountsVarsProps,
} from "../../lib/apollo/api/getAmounts";

const Index: React.FC<ServerSideProps> = ({
  yearAndMonth,
  historiesData,
  usersData,
  amountsData,
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const currentYear = dayjs(yearAndMonth).format("YYYY");
  const currentMonth = dayjs(yearAndMonth).format("MM");
  const getHistoriesQueryVars = {
    groupID: "1",
    year: currentYear,
    month: currentMonth,
  };
  const {
    loading: historiesLoading,
    error: historiesError,
    // data: historiesData,
    fetchMore: fetchMoreHistories,
    networkStatus: getHistoriesNetworkStatus,
  } = useQuery<getHistoriesProps, getHistoriesVarsProps>(GET_HISTORIES, {
    variables: getHistoriesQueryVars,
    // networkStatusが変わるとコンポーネントが再レンダリングされる
    notifyOnNetworkStatusChange: true,
  });

  const loadingMoreHistories =
    getHistoriesNetworkStatus === NetworkStatus.fetchMore;

  const loadMoreHistories = () => {
    fetchMoreHistories({
      variables: getHistoriesQueryVars,
    });
  };

  const getAmountsQueryVars = {
    year: currentYear,
    month: currentMonth,
    groupID: "1",
    userID: "1",
  };
  const {
    loading: amountsLoading,
    error: amountsError,
    // data: amountsData,
    fetchMore: fetchMoreamounts,
    networkStatus: getAmountsNetworkStatus,
  } = useQuery<getAmountsProps, getAmountsVarsProps>(GET_AMOUNTS, {
    variables: getAmountsQueryVars,
    notifyOnNetworkStatusChange: true,
  });

  const loadingMoreAmounts =
    getAmountsNetworkStatus === NetworkStatus.fetchMore;

  const loadMoreAmounts = () => {
    fetchMoreamounts({
      variables: getAmountsQueryVars,
    });
  };

  const loadMore = () => {
    loadMoreHistories();
    loadMoreAmounts();
  };

  return (
    <div>
      <Main>
        <Overview
          yearAndMonth={yearAndMonth}
          usersData={usersData}
          amountsData={amountsData}
          amountsLoading={amountsLoading}
          amountsError={amountsError}
          loadingMoreAmounts={loadingMoreAmounts}
        />
        <History
          loading={historiesLoading}
          error={historiesError}
          data={historiesData}
          loadingMoreHistories={loadingMoreHistories}
        />
        <AddButton size="large" onClick={openModal}>
          <AddIcon />
        </AddButton>
        <AddFormModal
          isOpen={isModalOpen}
          close={closeModal}
          onAdd={loadMore}
        />
      </Main>

      <Footer>© allrights reserved seiji yoshino</Footer>
    </div>
  );
};

const Main = styled("main")`
  position: relative;
`;

const AddButton = styled(IconButton)(
  ({ theme }) => `
  background-color: ${theme.palette.primary.main} !important;
  color: #fff;
  position: fixed;
  bottom: 20px;
  right: 20px;
`
);

const Footer = styled("footer")`
  display: flex;
  flex: 1;
  padding: 2rem 0;
  border-top: 1px solid #eaeaea;
  justify-content: center;
  align-items: center;
`;

export default Index;
