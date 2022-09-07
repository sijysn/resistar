import { gql } from "@apollo/client";

export const INVITE_USER_TO_GROUP = gql`
  mutation($email: String!, $groupID: ID!) {
    inviteUserToGroup(input: { email: $email, groupID: $groupID }) {
      success
      message
    }
  }
`;

export type inviteUserToGroupProps = {
  inviteUserToGroup: {
    success: boolean;
    message: string;
  };
};

export type inviteUserToGroupVarsProps = {
  email: string;
  groupID: string;
};
