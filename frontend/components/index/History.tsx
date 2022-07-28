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
];

const History = () => {
  return (
    <HistoryList>
      {historyList.map(({ id, title, price, fromUser, toUsers, createdAt }) => {
        return (
          <ListItem key={id}>
            <ListItemAvatar sx={{ position: "relative" }}>
              <Avatar src={fromUser.imageUrl} />
              <Avatar src={fromUser.imageUrl} />
            </ListItemAvatar>
            <ListItemText
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
          </ListItem>
        );
      })}
    </HistoryList>
  );
};

const HistoryList = styled(List)(
  ({ theme }) => `
  width: 100%;
  maxWidth: 360px;
  background-color: ${theme.palette.background.paper};
`
);

const ToUsers = styled("span")`
  display: flex;
`;

const ToUserAvatar = styled(Avatar)`
  width: 20px;
  height: 20px;
` as typeof Avatar;

const Price = styled("p")`
  text-align: end;
`;

export default History;
