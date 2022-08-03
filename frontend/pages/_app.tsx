import Head from "next/head";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import CssBaseline from "@mui/material/CssBaseline";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Resistar</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CssBaseline>
        <Component {...pageProps} />
      </CssBaseline>
    </>
  );
}

export default MyApp;
