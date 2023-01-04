import { gql } from "@apollo/client";

export const DELETE_HISTORY = gql`
  mutation($id: ID!) {
    deleteHistory(input: { id: $id }) {
      message
      success
    }
  }
`;

export type deleteHistoryProps = {
  deleteHistory: {
    message: string;
    success: boolean;
  };
};

export type deleteHistoryVarsProps = {
  id: string;
};
