import { gql } from "@apollo/client";

export const ADD_HISTORY = gql`
  mutation(
    $groupID: ID!
    $title: String!
    $type: Type!
    $price: Int!
    $fromUserIds: [ID!]!
    $toUserIds: [ID!]!
  ) {
    addHistory(
      input: {
        groupID: $groupID
        title: $title
        type: $type
        price: $price
        fromUserIds: $fromUserIds
        toUserIds: $toUserIds
      }
    ) {
      id
    }
  }
`;

export type addHistoryProps = {
  History: {
    id: string;
  };
};

export const QUERY_TYPE_DIARY = "DIARY";
export const QUERY_TYPE_TRAVEL = "TRAVEL";
export const QUERY_TYPE_RENT = "RENT";
export const QUERY_TYPE_UTILITY = "UTILITY";
export const QUERY_TYPE_COMMUNICATION = "COMMUNICATION";
export const QUERY_TYPE_FOOD = "FOOD";
export const QUERY_TYPE_OTHERS = "OTHERS";

export type QueryType =
  | typeof QUERY_TYPE_DIARY
  | typeof QUERY_TYPE_TRAVEL
  | typeof QUERY_TYPE_RENT
  | typeof QUERY_TYPE_UTILITY
  | typeof QUERY_TYPE_COMMUNICATION
  | typeof QUERY_TYPE_FOOD
  | typeof QUERY_TYPE_OTHERS;

export const QueryTypes = [
  QUERY_TYPE_DIARY,
  QUERY_TYPE_TRAVEL,
  QUERY_TYPE_RENT,
  QUERY_TYPE_UTILITY,
  QUERY_TYPE_COMMUNICATION,
  QUERY_TYPE_FOOD,
  QUERY_TYPE_OTHERS,
];

export const DISPLAYED_TYPE_DIARY = "日用品";
export const DISPLAYED_TYPE_TRAVEL = "交通費";
export const DISPLAYED_TYPE_RENT = "家賃";
export const DISPLAYED_TYPE_UTILITY = "水道光熱費";
export const DISPLAYED_TYPE_COMMUNICATION = "通信費";
export const DISPLAYED_TYPE_FOOD = "食費";
export const DISPLAYED_TYPE_OTHERS = "その他";

export type DisplayedType =
  | typeof DISPLAYED_TYPE_DIARY
  | typeof DISPLAYED_TYPE_TRAVEL
  | typeof DISPLAYED_TYPE_RENT
  | typeof DISPLAYED_TYPE_UTILITY
  | typeof DISPLAYED_TYPE_COMMUNICATION
  | typeof DISPLAYED_TYPE_FOOD
  | typeof DISPLAYED_TYPE_OTHERS;

export const DisplayedTypes = [
  DISPLAYED_TYPE_DIARY,
  DISPLAYED_TYPE_TRAVEL,
  DISPLAYED_TYPE_RENT,
  DISPLAYED_TYPE_UTILITY,
  DISPLAYED_TYPE_COMMUNICATION,
  DISPLAYED_TYPE_FOOD,
  DISPLAYED_TYPE_OTHERS,
];

export const TypesMaster: { [key in DisplayedType]: QueryType } = {
  [DISPLAYED_TYPE_DIARY]: QUERY_TYPE_DIARY,
  [DISPLAYED_TYPE_TRAVEL]: QUERY_TYPE_TRAVEL,
  [DISPLAYED_TYPE_RENT]: QUERY_TYPE_RENT,
  [DISPLAYED_TYPE_UTILITY]: QUERY_TYPE_UTILITY,
  [DISPLAYED_TYPE_COMMUNICATION]: QUERY_TYPE_COMMUNICATION,
  [DISPLAYED_TYPE_FOOD]: QUERY_TYPE_FOOD,
  [DISPLAYED_TYPE_OTHERS]: QUERY_TYPE_OTHERS,
};

export type addHistoryVarsProps = {
  groupID: string;
  title: string;
  type: QueryType;
  price: number;
  fromUserIds: string[];
  toUserIds: string[];
};
