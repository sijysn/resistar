import * as React from "react";
import { useQuery, useMutation, NetworkStatus } from "@apollo/client";
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
import {
  DELETE_HISTORY,
  deleteHistoryProps,
  deleteHistoryVarsProps,
} from "../../lib/apollo/api/deleteHistory";
import {
  getAdjustmentsProps,
  getAdjustmentsVarsProps,
  GET_ADJUSTMENTS,
} from "../../lib/apollo/api/getAdjustments";

const Index: React.FC<ServerSideProps> = ({ yearAndMonth, cookies }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const [message, setMessage] = React.useState("");

  const currentYear = dayjs(yearAndMonth).format("YYYY");
  const currentMonth = dayjs(yearAndMonth).format("MM");
  const getHistoriesQueryVars = {
    groupID: cookies["groupID"],
    year: currentYear,
    month: currentMonth,
  };
  const {
    loading: historiesLoading,
    error: historiesError,
    data: historiesData,
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
    groupID: cookies["groupID"],
    userID: cookies["userID"],
  };
  const {
    loading: amountsLoading,
    error: amountsError,
    data: amountsData,
    fetchMore: fetchMoreAmounts,
    networkStatus: getAmountsNetworkStatus,
  } = useQuery<getAmountsProps, getAmountsVarsProps>(GET_AMOUNTS, {
    variables: getAmountsQueryVars,
    notifyOnNetworkStatusChange: true,
  });

  const loadingMoreAmounts =
    getAmountsNetworkStatus === NetworkStatus.fetchMore;

  const loadMoreAmounts = () => {
    fetchMoreAmounts({
      variables: getAmountsQueryVars,
    });
  };

  const getAdjustmentQueryVars = {
    groupID: cookies["groupID"],
    year: currentYear,
    month: currentMonth,
  };
  const { fetchMore: fetchMoreAdjustments } = useQuery<
    getAdjustmentsProps,
    getAdjustmentsVarsProps
  >(GET_ADJUSTMENTS, {
    variables: getAdjustmentQueryVars,
    notifyOnNetworkStatusChange: true,
  });

  const loadMoreAdjustments = async () => {
    await fetchMoreAdjustments({
      variables: getAdjustmentQueryVars,
    });
  };

  const loadMore = React.useCallback(() => {
    loadMoreHistories();
    loadMoreAmounts();
    loadMoreAdjustments();
  }, [loadMoreHistories, loadMoreAmounts, loadMoreAdjustments]);

  const [_delete] = useMutation<deleteHistoryProps, deleteHistoryVarsProps>(
    DELETE_HISTORY
  );
  const deleteHistory = async (id: string) => {
    if (!window.confirm("本当に消してよろしいですか？")) {
      return;
    }
    const deleteHistoryQueryVars: deleteHistoryVarsProps = {
      id: id,
    };
    const { data } = await _delete({
      variables: deleteHistoryQueryVars,
    });
    if (!data) {
      setMessage("予期せぬエラーが起こりました");
      return;
    }
    const { message: deleteMessage, success } = data.deleteHistory;
    if (success) {
      loadMore();
      return;
    }
    if (deleteMessage) {
      setMessage(deleteMessage);
    }
  };

  return (
    <>
      <Main>
        <Overview
          yearAndMonth={yearAndMonth}
          cookies={cookies}
          amountsData={amountsData}
          amountsLoading={amountsLoading || loadingMoreAmounts}
          amountsError={amountsError}
        />
        <History
          loading={historiesLoading || loadingMoreHistories}
          error={historiesError}
          data={historiesData}
          handleClick={deleteHistory}
        />
        <AddButton size="large" onClick={openModal}>
          <AddIcon />
        </AddButton>
        <AddFormModal
          isOpen={isModalOpen}
          close={closeModal}
          onAdd={loadMore}
          cookies={cookies}
        />
      </Main>

      <Footer>© allrights reserved seiji yoshino</Footer>
    </>
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
