import type { AppProps } from "next/app";
import "@vercel/examples-ui/globals.css";
import { ApolloProvider } from "@apollo/client";
import { client } from "apollo-client";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
