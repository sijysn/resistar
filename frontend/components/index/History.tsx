import * as React from "react";
import { useQuery, NetworkStatus, ApolloError } from "@apollo/client";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/material";
import {
  GET_HISTORIES,
  getHistoriesProps,
  getHistoriesVarsProps,
} from "../../lib/api/getHistories";
import dayjs from "dayjs";

type Props = {
  loading: boolean;
  error?: ApolloError;
  data?: getHistoriesProps;
  loadingMoreHistories: boolean;
};

const History: React.FC<Props> = ({
  loading,
  error,
  data,
  loadingMoreHistories,
}) => {
  if (error) return <div>Error</div>;
  if ((loading && !loadingMoreHistories) || !data) return <div>Loading</div>;
  if (data.histories.length === 0) return <div>データがありません。</div>;
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
