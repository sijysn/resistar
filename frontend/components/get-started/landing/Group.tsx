import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { styled } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { UserProps } from "../../../lib/apollo/api/getUsers";

const Group: React.FC<Props> = ({ id, name, users, handleClick }) => {
  return (
    <Card
      sx={{
        display: "flex",
        justifyContent: "space-between",
        padding: "8px",
        marginBottom: "4px",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <CardContent sx={{ padding: "8px" }}>
          <Typography variant="h6">{name}</Typography>
        </CardContent>
        <Box sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}>
          <Members>
            <Typography
              variant="body2"
              sx={{
                display: "flex",
                alignItems: "center",
                color: "#73777B",
                fontSize: "12px",
              }}
            >
              {users.length.toLocaleString()}人のメンバー
            </Typography>
            <MemberList>
              {users.map(({ id, imageURL }, index) => {
                if (index < displayableUsersCount) {
                  return <Member key={id} src={imageURL} />;
                }
                return <></>;
              })}
            </MemberList>
          </Members>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "8px",
        }}
      >
        <Button onClick={() => handleClick(id)} variant="contained">
          <Typography color="common.white" variant="button">
            参加
          </Typography>
        </Button>
      </Box>
    </Card>
  );
};

const displayableUsersCount = 5;
const memberSize = 20;

type Props = {
  id: string;
  name: string;
  users: UserProps[];
  handleClick: (id: string) => void;
};

const Members = styled("div")`
  padding-top: 8px;
  display: flex;
  flex-direction: column;
`;

const MemberList = styled("div")`
  display: flex;
  justify-content: flex-start;
  width: ${memberSize * 5}px;
`;

const Member = styled(Avatar)`
  width: ${memberSize}px;
  height: ${memberSize}px;
` as typeof Avatar;

export default Group;
