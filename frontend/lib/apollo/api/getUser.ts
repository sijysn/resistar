import { gql } from "@apollo/client";

export const GET_USER = gql`
  query GetUser($userID: ID!) {
    user(input: { userID: $userID }) {
      id
      name
      email
      imageURL
    }
  }
`;

export type UserProps = {
  id: string;
  name: string;
  email: string;
  imageURL?: string;
};

export type getUserProps = {
  user: UserProps;
};

export type getUserVarsProps = {
  userID: string;
};
