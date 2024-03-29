import * as React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/material";

type Props = {
  name: string;
  email: string;
  imageURL: string;
  handleImageURL?: (url: string) => void;
};

const MemberItem: React.FC<Props> = ({
  name,
  email,
  imageURL,
  handleImageURL,
}) => {
  return (
    <MembersListItem>
      <StyledListItemAvatar>
        <Avatar
          src={imageURL}
          onClick={handleImageURL ? () => handleImageURL(imageURL) : undefined}
        />
      </StyledListItemAvatar>
      <StyledListItemText primary={name} secondary={email} />
    </MembersListItem>
  );
};

const MembersListItem = styled(ListItem)`
  padding: 16px;
  height: 76px;
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

export default MemberItem;
