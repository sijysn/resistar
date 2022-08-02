import * as React from "react";
import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import History from "../components/index/History";
import Overview from "../components/index/Overview";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/material";
import AddFormModal from "../components/index/AddFormModal";

const Home: NextPage = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <Main>
        <Overview />
        <History />
        <IconButton
          aria-label="add"
          size="large"
          sx={{
            bgcolor: "#f68989 !important",
            color: "#fff",
            position: "fixed",
            bottom: "20px",
            right: "20px",
          }}
          onClick={openModal}
        >
          <AddIcon />
        </IconButton>
        <AddFormModal isOpen={isModalOpen} close={closeModal} />
      </Main>

      <footer className={styles.footer}>
        © allrights reserved seiji yoshino
      </footer>
    </div>
  );
};

const Main = styled("main")`
  position: relative;
`;

export default Home;
