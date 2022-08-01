import * as React from "react";
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
    fromUser: { id: 1, username: "seiji", imageUrl: "" },
    toUsers: [
      { id: 2, username: "motsu", imageUrl: "" },
      { id: 3, username: "kanta", imageUrl: "" },
    ],
    createdAt: "2022-07-28",
  },
  {
    id: 2,
    title: "洗剤の購入",
    price: 1200,
    type: "daily",
    fromUser: { id: 1, username: "seiji", imageUrl: "" },
    toUsers: [
      { id: 2, username: "motsu", imageUrl: "" },
      { id: 3, username: "kanta", imageUrl: "" },
    ],
    createdAt: "2022-07-28",
  },
  {
    id: 3,
    title: "洗剤の購入",
    price: 1200,
    type: "daily",
    fromUser: { id: 1, username: "seiji", imageUrl: "" },
    toUsers: [
      { id: 2, username: "motsu", imageUrl: "" },
      { id: 3, username: "kanta", imageUrl: "" },
    ],
    createdAt: "2022-07-28",
  },
  {
    id: 4,
    title: "洗剤の購入",
    price: 1200,
    type: "daily",
    fromUser: { id: 1, username: "seiji", imageUrl: "" },
    toUsers: [
      { id: 2, username: "motsu", imageUrl: "" },
      { id: 3, username: "kanta", imageUrl: "" },
    ],
    createdAt: "2022-07-28",
  },
  {
    id: 5,
    title: "洗剤の購入",
    price: 1200,
    type: "daily",
    fromUser: { id: 1, username: "seiji", imageUrl: "" },
    toUsers: [
      { id: 2, username: "motsu", imageUrl: "" },
      { id: 3, username: "kanta", imageUrl: "" },
    ],
    createdAt: "2022-07-28",
  },
  {
    id: 6,
    title: "洗剤の購入",
    price: 1200,
    type: "daily",
    fromUser: { id: 1, username: "seiji", imageUrl: "" },
    toUsers: [
      { id: 2, username: "motsu", imageUrl: "" },
      { id: 3, username: "kanta", imageUrl: "" },
    ],
    createdAt: "2022-07-28",
  },
  {
    id: 7,
    title: "洗剤の購入",
    price: 1200,
    type: "daily",
    fromUser: { id: 1, username: "seiji", imageUrl: "" },
    toUsers: [
      { id: 2, username: "motsu", imageUrl: "" },
      { id: 3, username: "kanta", imageUrl: "" },
    ],
    createdAt: "2022-07-28",
  },
  {
    id: 8,
    title: "洗剤の購入",
    price: 1200,
    type: "daily",
    fromUser: { id: 1, username: "seiji", imageUrl: "" },
    toUsers: [
      { id: 2, username: "motsu", imageUrl: "" },
      { id: 3, username: "kanta", imageUrl: "" },
    ],
    createdAt: "2022-07-28",
  },
  {
    id: 9,
    title: "洗剤の購入",
    price: 1200,
    type: "daily",
    fromUser: { id: 1, username: "seiji", imageUrl: "" },
    toUsers: [
      { id: 2, username: "motsu", imageUrl: "" },
      { id: 3, username: "kanta", imageUrl: "" },
    ],
    createdAt: "2022-07-28",
  },
];

const History = () => {
  return (
    <HistoryList>
      {historyList.map(({ id, title, price, fromUser, toUsers, createdAt }) => {
        return (
          <HistoryListItem key={id}>
            <StyledListItemAvatar>
              <Avatar src={fromUser.imageUrl} />
              <FromUserAvatar src={fromUser.imageUrl} />
            </StyledListItemAvatar>
            <StyledListItemText
              primary={title}
              secondary={
                <ToUsers>
                  {toUsers.map(({ id, imageUrl }) => {
                    return (
                      <ToUserAvatar key={id} src={imageUrl} component="span" />
                    );
                  })}
                </ToUsers>
              }
            />
            <ListItemText primary={<Price>¥{price}</Price>} />
          </HistoryListItem>
        );
      })}
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
