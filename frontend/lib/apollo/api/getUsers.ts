import { gql } from "@apollo/client";
import { UserProps } from "./getUser";

export const GET_USERS = gql`
  query GetUsers($groupID: ID!) {
    users(input: { groupID: $groupID }) {
      id
      name
      email
      imageURL
    }
  }
`;

export type getUsersProps = {
  users: UserProps[];
};

export type getUsersVarsProps = {
  groupID: string;
};
