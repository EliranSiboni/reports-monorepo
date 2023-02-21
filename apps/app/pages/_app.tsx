import type { AppProps } from "next/app";
import "@vercel/examples-ui/globals.css";
import { ApolloProvider } from "@apollo/client";
import { ChakraProvider } from "@chakra-ui/react";

import { client } from "apollo-client";
import theme from "theme";
import Head from "next/head";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <ChakraProvider theme={theme}>
        <Head>
          <title>Reports using Next.js + Apollo + Chakra UI</title>
        </Head>
        <Component {...pageProps} />
      </ChakraProvider>
    </ApolloProvider>
  );
}
