import { gql } from "@apollo/client";
import { GroupProps } from "./getGroups";

export const GET_GROUPS_WHERE_USER_HAS_BEEN_INVITED = gql`
  query GetGroupsWhereUserHasBeenInvited($userID: ID!) {
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

export type getGroupsWhereUserHasBeenInvitedProps = {
  groupsWhereUserHasBeenInvited: GroupProps[];
};

export type getGroupsWhereUserHasBeenInvitedVarsProps = {
  userID: string;
};
