import * as React from "react";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/material";
import History from "./History";
import Overview from "./Overview";
import AddFormModal from "./AddFormModal";
import styles from "../../styles/Home.module.css";

type Props = {
  yearAndMonth: string;
};

const Index: React.FC<Props> = ({ yearAndMonth }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <Main>
        <Overview yearAndMonth={yearAndMonth} />
        <History />
        <AddButton aria-label="add" size="large" onClick={openModal}>
          <AddIcon />
        </AddButton>
        <AddFormModal isOpen={isModalOpen} close={closeModal} />
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
