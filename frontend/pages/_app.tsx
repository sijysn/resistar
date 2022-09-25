import Head from "next/head";
import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { useApollo } from "../lib/apollo/apollo-client";
import { theme } from "../lib/theme";
import "../styles/globals.css";
import { parseCookies } from "nookies";

function MyApp({ Component, pageProps }: AppProps) {
  const cookies = parseCookies();
  const apolloClient = useApollo(pageProps, cookies["jwtToken"]);
  return (
    <>
      <Head>
        <title>Resistar</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/images/icon-192x192.png"></link>
        <meta name="theme-color" content="#fff" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
      </Head>
      <ApolloProvider client={apolloClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </ApolloProvider>
    </>
  );
}

export default MyApp;
