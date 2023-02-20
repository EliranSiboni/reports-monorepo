import { ApolloClient, InMemoryCache } from "@apollo/client/core";
import { YogaLink } from "@graphql-yoga/apollo-link";

export const client = new ApolloClient({
  link: new YogaLink({
    endpoint: "http://localhost:4000/graphql",
  }) as any,
  cache: new InMemoryCache(),
});
