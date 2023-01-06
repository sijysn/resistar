import * as React from "react";
import { ApolloError } from "@apollo/client";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { css, Divider, styled } from "@mui/material";
import { getHistoriesProps } from "../../lib/apollo/api/getHistories";
import {
  QueryType,
  QUERY_TYPE_DIARY,
  QUERY_TYPE_TRAVEL,
  QUERY_TYPE_RENT,
  QUERY_TYPE_UTILITY,
  QUERY_TYPE_COMMUNICATION,
  QUERY_TYPE_FOOD,
  QUERY_TYPE_OTHERS,
} from "../../lib/apollo/api/addHistory";
import { COLOR } from "../../lib/color";
import dayjs from "dayjs";

type Props = {
  loading: boolean;
  error?: ApolloError;
  data?: getHistoriesProps;
  handleClick: (id: string) => void;
};

const History: React.FC<Props> = ({ loading, error, data, handleClick }) => {
  if (error) return <Message>{error.message}</Message>;
  if (loading || !data) return <Message>Loading</Message>;
  if (data.histories.length === 0)
    return <Message>データがありません。</Message>;
  return (
    <HistoryList>
      {data.histories.map(
        ({ id, title, type, price, fromUsers, toUsers, createdAt }, index) => {
          const typeAvatarStyle = css`
            background-color: ${getColor(type)};
          `;
          return (
            <React.Fragment key={id}>
              {showDate(createdAt, index, data) && (
                <DateWrapper>
                  <Date variant="body2" color="text.secondary">
                    {dayjs(createdAt).format("M")}月
                    {dayjs(createdAt).format("DD")}日
                  </Date>
                  <Divider />
                </DateWrapper>
              )}
              <HistoryListItem>
                <StyledListItemAvatar>
                  <TypeAvatar
                    src={`/images/types/${type}.svg`}
                    css={typeAvatarStyle}
                  />
                  {fromUsers.map(({ id, imageURL }, index) => {
                    if (index === 0) {
                      return <FromUserAvatar1 src={imageURL} key={id} />;
                    }
                    if (index === 1) {
                      return <FromUserAvatar2 src={imageURL} key={id} />;
                    }
                    if (index === 2) {
                      return <FromUserAvatar3 src={imageURL} key={id} />;
                    }
                    return <React.Fragment key={id}></React.Fragment>;
                  })}
                </StyledListItemAvatar>
                <StyledListItemText
                  primary={title}
                  secondary={
                    <ToUsers>
                      {toUsers.map(({ id, imageURL }, index) => {
                        if (index < displayableUsers) {
                          return (
                            <ToUserAvatar
                              key={id}
                              src={imageURL}
                              component="span"
                            />
                          );
                        }
                        return <React.Fragment key={id}></React.Fragment>;
                      })}
                      {toUsers.length > displayableUsers && (
                        <AndMore>+{toUsers.length - displayableUsers}</AndMore>
                      )}
                    </ToUsers>
                  }
                />
                <LastListItemText
                  primary={
                    <LastListItemTextWrapper>
                      <Price>¥{price.toLocaleString()}</Price>
                      <Button onClick={() => handleClick(id)}>
                        <Delete variant="button" color="common.black">
                          削除
                        </Delete>
                      </Button>
                    </LastListItemTextWrapper>
                  }
                />
              </HistoryListItem>
            </React.Fragment>
          );
        }
      )}
    </HistoryList>
  );
};

const getColor = (type: QueryType) => {
  switch (type) {
    case QUERY_TYPE_DIARY:
      return COLOR.TYPE_DIARY;
    case QUERY_TYPE_TRAVEL:
      return COLOR.TYPE_TRAVEL;
    case QUERY_TYPE_RENT:
      return COLOR.TYPE_RENT;
    case QUERY_TYPE_UTILITY:
      return COLOR.TYPE_UTILITY;
    case QUERY_TYPE_COMMUNICATION:
      return COLOR.TYPE_COMMUNICATION;
    case QUERY_TYPE_FOOD:
      return COLOR.TYPE_FOOD;
    case QUERY_TYPE_OTHERS:
      return COLOR.TYPE_OTHERS;
    default:
      return COLOR.TYPE_OTHERS;
  }
};

const showDate = (
  createdAt: string,
  index: number,
  data: getHistoriesProps
) => {
  if (index === 0) {
    return true;
  }
  const lastHistoryDay = dayjs(data.histories[index - 1].createdAt).format(
    "DD"
  );
  const currentHistoryDay = dayjs(createdAt).format("DD");
  return lastHistoryDay !== currentHistoryDay;
};

const displayableUsers = 3;

const HistoryList = styled(List)(
  ({ theme }) => `
  width: 100%;
  max-width: 360px;
  background-color: ${theme.palette.background.paper};
  margin: 0 auto;
`
) as typeof List;

const DateWrapper = styled("div")`
  padding: 0 16px;
`;

const Date = styled(Typography)`
  padding: 8px 0;
`;

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
  padding: 0 8px;
  > span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const AndMore = styled("span")`
  margin-left: 8px;
`;

const ToUsers = styled("span")`
  display: flex;
`;

const ToUserAvatar = styled(Avatar)`
  width: 20px;
  height: 20px;
` as typeof Avatar;

const LastListItemText = styled(ListItemText)`
  flex: none;
`;

const LastListItemTextWrapper = styled("div")`
  display: flex;
  align-items: center;
`;

const Price = styled("p")`
  text-align: end;
  margin: 0;
  padding: 6px 8px;
`;

const Delete = styled(Typography)`
  opacity: 0.5;
`;

const Message = styled("p")`
  text-align: center;
`;

export default History;
