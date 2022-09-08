import { gql } from "@apollo/client";
import { UserProps } from "./getUsers";

export const GET_ADJUSTMENT = gql`
  query($groupID: ID!, $year: String!, $month: String!) {
    adjustment(input: { groupID: $groupID, year: $year, month: $month }) {
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

export type AdjustmentProps = {
  fromUser: UserProps;
  toUser: UserProps;
  amount: number;
};

export type getAdjustmentProps = {
  adjustment: AdjustmentProps[];
};

export type getAdjustmentVarsProps = {
  groupID: string;
  year: string;
  month: string;
};
