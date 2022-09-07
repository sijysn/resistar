import { gql } from "@apollo/client";
import { UserProps } from "./getUsers";

export const GET_GROUPS_WHERE_USER_HAS_BEEN_INVITED = gql`
  query($userID: ID!) {
    groupsWhereUserHasBeenInvited(input: { userID: $userID }) {
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

export type GroupWhereUserHasBeenInvitedProps = {
  id: string;
  name: string;
  users: UserProps[];
};

export type getGroupsWhereUserHasBeenInvitedProps = {
  groupsWhereUserHasBeenInvited: GroupWhereUserHasBeenInvitedProps[];
};

export type getGroupsWhereUserHasBeenInvitedVarsProps = {
  userID: string;
};
