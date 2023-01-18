import { gql } from "@apollo/client";
import { UserProps } from "./getUser";

export const GET_ADJUSTMENTS = gql`
  query Adjustments($groupID: ID!, $year: String!, $month: String!) {
    adjustments(input: { groupID: $groupID, year: $year, month: $month }) {
      id
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
  id: string;
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
