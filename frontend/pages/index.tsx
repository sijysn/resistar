import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import History from "../components/index/History";
import Overview from "../components/index/Overview";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/material";

const Home: NextPage = () => {
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
        >
          <AddIcon />
        </IconButton>
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
