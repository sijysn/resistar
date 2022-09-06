import { gql } from "@apollo/client";

export const ADD_GROUP = gql`
  mutation($userID: ID!, $groupName: String!) {
    addGroup(input: { userID: $userID, groupName: $groupName }) {
      id
      name
      errorMessage
    }
  }
`;

export type addGroupProps = {
  addGroup: {
    id: string;
    name: string;
    errorMessage: string;
  };
};

export type addGroupVarsProps = {
  userID: string;
  groupName: string;
};
