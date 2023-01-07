import { gql } from "@apollo/client";

export const LOGIN_GROUP = gql`
  mutation LoginGroup($userID: ID!, $groupID: ID!) {
    loginGroup(input: { userID: $userID, groupID: $groupID }) {
      message
      success
    }
  }
`;

export type loginGroupProps = {
  loginGroup: {
    message: string;
    success: boolean;
  };
};

export type loginGroupVarsProps = {
  userID: string;
  groupID: string;
};
