import { gql } from "@apollo/client";

export const ADD_USER = gql`
  mutation AddUser($email: String!, $password: String!) {
    addUser(input: { email: $email, password: $password }) {
      message
      success
    }
  }
`;

export type addUserProps = {
  addUser: {
    message: string;
    success: boolean;
  };
};

export type addUserVarsProps = {
  email: string;
  password: string;
};
