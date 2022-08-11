import * as React from "react";
import { ApolloError } from "@apollo/client";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { css, styled } from "@mui/material";
import { getHistoriesProps } from "../../lib/api/getHistories";

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
        ({ id, title, type, price, fromUsers, toUsers, createdAt }) => {
          return (
            <HistoryListItem key={id}>
              <StyledListItemAvatar>
                <TypeAvatar src={`/images/types/${type}.svg`} />
                {fromUsers.map(({ id, imageURL }, index) => {
                  if (index === 0) {
                    return <FromUserAvatar1 src={imageURL} key={id} />;
                  }
                  if (index === 1) {
                    return <FromUserAvatar2 src={imageURL} key={id} />;
                  }
                  if (index === 1) {
                    return <FromUserAvatar3 src={imageURL} key={id} />;
                  }
                  return <React.Fragment key={id}></React.Fragment>;
                })}
              </StyledListItemAvatar>
              <StyledListItemText
                primary={title}
                secondary={
                  <ToUsers>
                    {toUsers.map(({ id, imageURL }) => {
                      return (
                        <ToUserAvatar
                          key={id}
                          src={imageURL}
                          component="span"
                        />
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

const TypeAvatar = styled(Avatar)`
  padding: 10px;
  background-color: red;
`;

const StyledListItemAvatar = styled(ListItemAvatar)`
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
` as typeof ListItemAvatar;

const FromUserAvatarCss = css`
  position: absolute;
  bottom: 0;
  width: 20px;
  height: 20px;
`;

const FromUserAvatar1 = styled(Avatar)`
  ${FromUserAvatarCss}
  z-index: 10;
  right: 10px;
`;

const FromUserAvatar2 = styled(Avatar)`
  ${FromUserAvatarCss}
  z-index: 5;
  right: 5px;
`;

const FromUserAvatar3 = styled(Avatar)`
  ${FromUserAvatarCss}
  z-index: 0;
  right: 0;
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
