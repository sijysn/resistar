import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    loginUser(input: { email: $email, password: $password }) {
      message
      success
    }
  }
`;

export type loginUserProps = {
  loginUser: {
    message: string;
    success: boolean;
  };
};

export type loginUserVarsProps = {
  email: string;
  password: string;
};
