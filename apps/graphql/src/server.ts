import { createYoga, createSchema, createPubSub } from "graphql-yoga";
import { createServer } from "node:http";
import mongoose from "mongoose";
import Report from "./database/schemas/report.js";

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
        reports: async () => await Report.where("state").ne("RESOLVED"),
      },
      Mutation: {
        addReport: async (parent, args) => {
          // validate fields
          if (!args.source) return false;

          try {
            // add report to database
            const newReport = {
              // create random id
              id: Math.random().toString(36).substr(2, 9),
              ...args,
            };

            const newReportModel = new Report(newReport);
            await newReportModel.save();

            pubSub.publish("NEW_REPORT", newReport);

            return newReport;
          } catch (e: any) {
            return new Error(e.message ?? "Something went wrong");
          }
        },
        resolveReport: async (parent, args) => {
          try {
            await Report.findOneAndUpdate(
              { id: args.id },
              { state: "RESOLVED" },
              { new: true }
            );

            pubSub.publish("UPDATE_REPORT", {
              id: args.id,
              state: "RESOLVED",
            });

            return true;
          } catch (e: any) {
            return new Error(e.message ?? "Something went wrong");
          }
        },
        blockReport: async (parent, args) => {
          try {
            const report = await Report.findOneAndUpdate(
              { id: args.id },
              { state: "BLOCKED" },
              { new: true }
            );

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

mongoose
  .connect(process.env.DATABASE_URL || "", {
    autoIndex: true,
  })
  .then((db) => {
    console.log("💾 Connected to database");
    return db;
  })
  .catch((err) => {
    console.log(err);
  });

const server = createServer(yoga);
server.listen(process.env.SERVER_PORT ?? 4000, () => {
  console.info(
    `🚀 Server is running on http://localhost:${process.env.SERVER_PORT}/graphql`
  );
});
