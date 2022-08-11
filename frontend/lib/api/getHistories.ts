import { gql } from "@apollo/client";
import { UserProps } from "./getUsers";

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
        imageURL
      }
      toUsers {
        id
        name
        imageURL
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

type HistoryProps = {
  id: string;
  title: string;
  price: number;
  type: string;
  fromUsers: UserProps[];
  toUsers: UserProps[];
  createdAt: string;
};
