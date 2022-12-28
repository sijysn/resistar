import { gql } from "@apollo/client";
import { UserProps } from "./getUsers";

export const GET_ADJUSTMENTS = gql`
  query($groupID: ID!, $year: String!, $month: String!) {
    adjustments(input: { groupID: $groupID, year: $year, month: $month }) {
      fromUser {
        id
        name
        email
      }
      toUser {
        id
        name
        email
      }
      amount
    }
  }
`;

export type AdjustmentsProps = {
  fromUser: UserProps;
  toUser: UserProps;
  amount: number;
};

export type getAdjustmentsProps = {
  adjustments: AdjustmentsProps[];
};

export type getAdjustmentsVarsProps = {
  groupID: string;
  year: string;
  month: string;
};
