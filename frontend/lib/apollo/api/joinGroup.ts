import { gql } from "@apollo/client";

export const JOIN_GROUP = gql`
  mutation JoinGroup($userID: ID!, $groupID: ID!) {
    joinGroup(input: { userID: $userID, groupID: $groupID }) {
      message
      success
    }
  }
`;

export type joinGroupProps = {
  joinGroup: {
    message: string;
    success: boolean;
  };
};

export type joinGroupVarsProps = {
  userID: string;
  groupID: string;
};
