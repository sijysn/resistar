import { gql } from "@apollo/client";

export const GET_AMOUNTS = gql`
  query GetAmounts(
    $year: String!
    $month: String!
    $groupID: ID!
    $userID: ID!
  ) {
    amounts(
      input: { year: $year, month: $month, groupID: $groupID, userID: $userID }
    ) {
      id
      personalBalance
      groupTotal
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
  id: string;
  personalBalance: number;
  groupTotal: number;
};
