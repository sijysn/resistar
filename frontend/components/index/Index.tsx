import * as React from "react";
import { useQuery, NetworkStatus } from "@apollo/client";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/material";
import History from "./History";
import Overview from "./Overview";
import AddFormModal from "./AddFormModal";
import {
  GET_HISTORIES,
  getHistoriesProps,
  getHistoriesVarsProps,
} from "../../lib/api/getHistories";
import dayjs from "dayjs";

type Props = {
  yearAndMonth: string;
};

const Index: React.FC<Props> = ({ yearAndMonth }) => {
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
  const { loading, error, data, fetchMore, networkStatus } = useQuery<
    getHistoriesProps,
    getHistoriesVarsProps
  >(GET_HISTORIES, {
    variables: getHistoriesQueryVars,
    // networkStatusが変わるとコンポーネントが再レンダリングされる
    notifyOnNetworkStatusChange: true,
  });

  const loadingMoreHistories = networkStatus === NetworkStatus.fetchMore;

  const loadMoreHistories = () => {
    fetchMore({
      variables: getHistoriesQueryVars,
    });
  };

  return (
    <div>
      <Main>
        <Overview yearAndMonth={yearAndMonth} />
        <History
          loading={loading}
          error={error}
          data={data}
          loadingMoreHistories={loadingMoreHistories}
        />
        <AddButton aria-label="add" size="large" onClick={openModal}>
          <AddIcon />
        </AddButton>
        <AddFormModal
          isOpen={isModalOpen}
          close={closeModal}
          onAdd={loadMoreHistories}
        />
      </Main>

      <Footer>© allrights reserved seiji yoshino</Footer>
    </div>
  );
};

const Main = styled("main")`
  position: relative;
`;

const AddButton = styled(IconButton)`
  background-color: #f68989 !important;
  color: #fff;
  position: fixed;
  bottom: 20px;
  right: 20px;
`;

const Footer = styled("footer")`
  display: flex;
  flex: 1;
  padding: 2rem 0;
  border-top: 1px solid #eaeaea;
  justify-content: center;
  align-items: center;
`;

export default Index;
