import Head from "next/head";
import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import CssBaseline from "@mui/material/CssBaseline";
import { useApollo } from "../lib/apollo-client";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps);
  return (
    <ApolloProvider client={apolloClient}>
      <Head>
        <title>Resistar</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CssBaseline>
        <Component {...pageProps} />
      </CssBaseline>
    </ApolloProvider>
  );
}

export default MyApp;
