import { gql } from "@apollo/client";

export const BLOCK_REPORT_MUTATION = gql`
  mutation blockReport($id: ID!) {
    blockReport(id: $id)
  }
`;

export const RESOLVE_REPORT_MUTATION = gql`
  mutation blockReport($id: ID!) {
    resolveReport(id: $id)
  }
`;
