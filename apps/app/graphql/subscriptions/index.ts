import { gql } from "@apollo/client";

export const REPORTS_SUBSCRIPTION = gql`
  subscription {
    broadcastReports {
      id
      state
      payload {
        reportType
        message
      }
    }
  }
`;
