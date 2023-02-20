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

export const REPORTS_UPDATE_SUBSCRIPTION = gql`
  subscription {
    updateReport {
      id
      state
    }
  }
`;
