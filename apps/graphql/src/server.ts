import { createYoga, createSchema, createPubSub } from "graphql-yoga";
import { createServer } from "node:http";
import reports from "./database/reports.json" assert { type: "json" };

const pubSub = createPubSub();

// Provide your schema
const yoga = createYoga({
  schema: createSchema({
    typeDefs: /* GraphQL */ `
      type Report {
        id: ID!
        source: String!
        sourceIdentityId: String!
        reference: Reference!
        state: String!
        payload: Payload!
        created: String!
      }

      type Reference {
        referenceId: String!
        referenceType: String!
      }

      type Payload {
        source: String!
        reportType: String!
        message: String
        reportId: String!
        referenceResourceId: String!
        referenceResourceType: String!
      }

      type Query {
        hello: String
        reports: [Report!]!
      }

      type Mutation {
        addReport(
          source: String!
          sourceIdentityId: String!
          reference: ReferenceInput!
          state: String!
          payload: PayloadInput!
        ): Report!
        resolveReport(id: ID!): Boolean!
        blockReport(id: ID!): Boolean!
      }

      type UpdateReport {
        id: ID!
        state: String!
      }

      type Subscription {
        broadcastReports: Report!
        updateReport: UpdateReport!
      }

      input ReferenceInput {
        referenceId: String!
        referenceType: String!
      }

      input PayloadInput {
        source: String!
        reportType: String!
        message: String
        reportId: String!
        referenceResourceId: String!
        referenceResourceType: String!
      }
    `,
    resolvers: {
      Query: {
        reports: () => reports.elements.filter((r) => r.state !== "RESOLVED"),
      },
      Mutation: {
        addReport: (parent, args) => {
          // validate fields
          if (!args.source) return false;

          try {
            // add report to database
            const newReport = {
              // create random id
              id: Math.random().toString(36).substr(2, 9),
              ...args,
            };

            reports.elements.push(newReport);

            pubSub.publish("NEW_REPORT", newReport);
            return newReport;
          } catch (e: any) {
            return new Error(e.message ?? "Something went wrong");
          }
        },
        resolveReport: (parent, args) => {
          try {
            const reportIndex = reports.elements.findIndex(
              (r) => r.id === args.id
            );
            if (!reports.elements[reportIndex]) return false;

            reports.elements[reportIndex].state = "RESOLVED";

            pubSub.publish("UPDATE_REPORT", {
              id: args.id,
              state: "RESOLVED",
            });

            return true;
          } catch (e: any) {
            return new Error(e.message ?? "Something went wrong");
          }
        },
        blockReport: (parent, args) => {
          try {
            const reportIndex = reports.elements.findIndex(
              (r) => r.id === args.id
            );
            if (!reports.elements[reportIndex]) return false;

            reports.elements[reportIndex].state = "BLOCKED";

            pubSub.publish("UPDATE_REPORT", {
              id: args.id,
              state: "BLOCKED",
            });

            return true;
          } catch (e: any) {
            return new Error(e.message ?? "Something went wrong");
          }
        },
      },
      Subscription: {
        broadcastReports: {
          resolve: (payload) => payload,
          subscribe: () => pubSub.subscribe("NEW_REPORT"),
        },
        updateReport: {
          resolve: (payload) => payload,
          subscribe: () => pubSub.subscribe("UPDATE_REPORT"),
        },
      },
    },
  }),
});

const server = createServer(yoga);
server.listen(process.env.SERVER_PORT ?? 4000, () => {
  console.info(
    `Server is running on http://localhost:${process.env.SERVER_PORT}/graphql`
  );
});
