import { gql } from "@apollo/client";

export const GET_HISTORIES = gql`
  query($groupID: ID!, $year: String!, $month: String!) {
    histories(input: { groupID: $groupID, year: $year, month: $month }) {
      id
      title
      price
      type
      fromUsers {
        id
        name
      }
      toUsers {
        id
        name
      }
      createdAt
    }
  }
`;

export type getHistoriesProps = {
  histories: HistoryProps[];
};

export type getHistoriesVarsProps = {
  groupID: string;
  year: string;
  month: string;
};

type User = {
  id: string;
  name: string;
  imageUrl?: string;
};

type HistoryProps = {
  id: string;
  title: string;
  price: number;
  type: string;
  fromUsers: User[];
  toUsers: User[];
  createdAt: string;
};
