import { gql } from "@apollo/client";

export const GET_AMOUNTS = gql`
  query($year: String!, $month: String!, $groupID: ID!, $userID: ID!) {
    amounts(
      input: { year: $year, month: $month, groupID: $groupID, userID: $userID }
    ) {
      personalBalance
    }
  }
`;

export type getAmountsProps = {
  amounts: AmountsProps;
};

export type getAmountsVarsProps = {
  year: string;
  month: string;
  groupID: string;
  userID: string;
};

type AmountsProps = {
  personalBalance: number;
};
