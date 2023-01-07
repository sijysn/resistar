import { gql } from "@apollo/client";

export const LOGOUT_GROUP = gql`
  mutation LogoutGroup {
    logoutGroup {
      message
      success
    }
  }
`;

export type logoutGroupProps = {
  logoutGroup: {
    message: string;
    success: boolean;
  };
};
