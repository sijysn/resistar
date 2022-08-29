import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation($email: String!, $password: String!, $groupID: ID!) {
    login(input: { email: $email, password: $password, groupID: $groupID }) {
      id
      email
      name
    }
  }
`;

export type UserProps = {
  id: string;
  email: string;
  name: string;
};

export type loginUserProps = {
  login: UserProps;
};

export type loginUserVarsProps = {
  email: string;
  password: string;
  groupID: string;
};
