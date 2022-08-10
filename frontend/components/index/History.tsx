import * as React from "react";
import { gql, useQuery, NetworkStatus } from "@apollo/client";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/material";

const historyList = [
  {
    id: 1,
    title: "洗剤の購入",
    price: 1200,
    type: "daily",
    fromUsers: [{ id: 1, name: "seiji", imageUrl: "" }],
    toUsers: [
      { id: 2, name: "motsu", imageUrl: "" },
      { id: 3, name: "kanta", imageUrl: "" },
    ],
    createdAt: "2022-07-28",
  },
  {
    id: 2,
    title: "洗剤の購入",
    price: 1200,
    type: "daily",
    fromUsers: [{ id: 1, name: "seiji", imageUrl: "" }],
    toUsers: [
      { id: 2, name: "motsu", imageUrl: "" },
      { id: 3, name: "kanta", imageUrl: "" },
    ],
    createdAt: "2022-07-28",
  },
];

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

export type HistoriesProps = {
  histories: HistoryProps[];
};

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

export const getHistoriesQueryVars = {
  groupID: "1",
  year: "2022",
  month: "08",
};

const History = () => {
  const { loading, error, data, networkStatus } = useQuery<HistoriesProps>(
    GET_HISTORIES,
    {
      variables: getHistoriesQueryVars,
      // networkStatusが変わるとコンポーネントが再レンダリングされる
      notifyOnNetworkStatusChange: true,
    }
  );

  const loadingMoreHistories = networkStatus === NetworkStatus.fetchMore;

  // const loadMoreHistories = () => {
  //   fetchMore({
  //     variables: {
  //       year: "2022",
  //       month: "08",
  //     },
  //   });
  // };

  if (error) return <div>Error</div>;
  if ((loading && !loadingMoreHistories) || !data) return <div>Loading</div>;
  return (
    <HistoryList>
      {data.histories.map(
        ({ id, title, price, fromUsers, toUsers, createdAt }) => {
          return (
            <HistoryListItem key={id}>
              <StyledListItemAvatar>
                {fromUsers.map(({ id }) => {
                  return (
                    <React.Fragment key={id}>
                      <Avatar src={""} />
                      <FromUserAvatar src={""} />
                    </React.Fragment>
                  );
                })}
              </StyledListItemAvatar>
              <StyledListItemText
                primary={title}
                secondary={
                  <ToUsers>
                    {toUsers.map(({ id }) => {
                      return (
                        <ToUserAvatar key={id} src={""} component="span" />
                      );
                    })}
                    {createdAt}
                  </ToUsers>
                }
              />
              <ListItemText
                primary={<Price>¥{price.toLocaleString()}</Price>}
              />
            </HistoryListItem>
          );
        }
      )}
    </HistoryList>
  );
};

const HistoryList = styled(List)(
  ({ theme }) => `
  width: 100%;
  max-width: 360px;
  background-color: ${theme.palette.background.paper};
  margin: 0 auto;
`
) as typeof List;

const HistoryListItem = styled(ListItem)`
  padding: 16px;
  height: 76px;
`;

const StyledListItemAvatar = styled(ListItemAvatar)`
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
` as typeof ListItemAvatar;

const FromUserAvatar = styled(Avatar)`
  position: absolute;
  bottom: 0;
  right: 10px;
  width: 20px;
  height: 20px;
`;

const StyledListItemText = styled(ListItemText)`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ToUsers = styled("span")`
  display: flex;
`;

const ToUserAvatar = styled(Avatar)`
  width: 20px;
  height: 20px;
` as typeof Avatar;

const Price = styled("p")`
  text-align: end;
  margin: 0;
`;

export default History;
