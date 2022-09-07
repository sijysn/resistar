import { gql } from "@apollo/client";
import { UserProps } from "./getUsers";

export const GET_GROUPS = gql`
  query($userID: ID!) {
    groups(input: { userID: $userID }) {
      id
      name
      users {
        id
        email
        name
        imageURL
      }
    }
  }
`;

export type GroupProps = {
  id: string;
  name: string;
  users: UserProps[];
};

export type getGroupsProps = {
  groups: GroupProps[];
};

export type getGroupsVarsProps = {
  userID: string;
};
