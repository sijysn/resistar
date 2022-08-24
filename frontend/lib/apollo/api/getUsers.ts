import { gql } from "@apollo/client";

export const GET_USERS = gql`
  query($groupID: ID!) {
    users(input: { groupID: $groupID }) {
      id
      name
      imageURL
    }
  }
`;

export type UserProps = {
  id: string;
  name: string;
  imageURL?: string;
};

export type getUsersProps = {
  users: UserProps[];
};

export type getUsersVarsProps = {
  groupID: string;
};
