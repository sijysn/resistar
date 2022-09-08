import * as React from "react";
import { ApolloError } from "@apollo/client";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material";
import { getUsersProps } from "../../../lib/apollo/api/getUsers";

type Props = {
  loading: boolean;
  error?: ApolloError;
  data?: getUsersProps;
};

const Members: React.FC<Props> = ({ loading, error, data }) => {
  if (error) return <Message>{error.message}</Message>;
  if (loading || !data) return <Message>Loading</Message>;
  if (data.users.length === 0) return <Message>メンバーがいません。</Message>;
  return (
    <MembersList>
      <MembersCountWrapper>
        <MembersCount variant="body2" color="text.secondary">
          メンバー({data.users.length})
        </MembersCount>
        <Divider />
      </MembersCountWrapper>
      {/* </DateWrapper> */}
      {data.users.map(({ id, name, email, imageURL }) => {
        return (
          <React.Fragment key={id}>
            <MembersListItem>
              <StyledListItemAvatar>
                <StyledAvatar src={imageURL} />
              </StyledListItemAvatar>
              <StyledListItemText primary={name} secondary={email} />
            </MembersListItem>
          </React.Fragment>
        );
      })}
    </MembersList>
  );
};

const MembersList = styled(List)(
  ({ theme }) => `
  width: 100%;
  max-width: 360px;
  background-color: ${theme.palette.background.paper};
  margin: 0 auto;
`
) as typeof List;

const MembersCountWrapper = styled("div")`
  padding: 16px;
`;

const MembersCount = styled(Typography)`
  padding: 8px 0;
`;

const MembersListItem = styled(ListItem)`
  padding: 16px;
  height: 76px;
`;

const StyledAvatar = styled(Avatar)`
  padding: 10px;
`;

const StyledListItemAvatar = styled(ListItemAvatar)`
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
` as typeof ListItemAvatar;

const StyledListItemText = styled(ListItemText)`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 8px;
`;

const Message = styled("p")`
  text-align: center;
`;

export default Members;
