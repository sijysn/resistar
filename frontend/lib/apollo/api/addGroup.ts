import { gql } from "@apollo/client";

export const ADD_GROUP = gql`
  mutation AddGroup($userID: ID!, $groupName: String!) {
    addGroup(input: { userID: $userID, groupName: $groupName }) {
      message
      success
    }
  }
`;

export type addGroupProps = {
  addGroup: {
    message: string;
    success: boolean;
  };
};

export type addGroupVarsProps = {
  userID: string;
  groupName: string;
};
