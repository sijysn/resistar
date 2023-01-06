import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { styled } from "@mui/material";
import Typography from "@mui/material/Typography";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import { HistoryProps } from "../../lib/apollo/api/getHistories";
type ModalProps = {
  isOpen: boolean;
  close: () => void;
  history: HistoryProps;
};

const HistoryDetailModal: React.FC<ModalProps> = ({
  isOpen,
  close,
  history,
}) => {
  return (
    <StyledDialog open={isOpen} keepMounted onClose={close}>
      <DialogTitle>
        <Typography component="h1" variant="h6">
          {history.title}
        </Typography>
      </DialogTitle>

      <StyledDialogContent>
        <SectionTitleWrapper>
          <SectionTitle variant="body2" color="text.secondary">
            合計額
          </SectionTitle>
          <Divider />
        </SectionTitleWrapper>
        <Price>¥{history.price.toLocaleString()}</Price>

        <SectionTitleWrapper>
          <SectionTitle variant="body2" color="text.secondary">
            1人あたりの支払い額
          </SectionTitle>
          <Divider />
        </SectionTitleWrapper>
        <Price>
          ¥{(history.price / history.toUsers.length).toLocaleString()}
        </Price>

        <SectionTitleWrapper>
          <SectionTitle variant="body2" color="text.secondary">
            負担者
          </SectionTitle>
          <Divider />
        </SectionTitleWrapper>
        {history.toUsers.map(({ id, name, email, imageURL }) => {
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

        <SectionTitleWrapper>
          <SectionTitle variant="body2" color="text.secondary">
            購入者
          </SectionTitle>
          <Divider />
        </SectionTitleWrapper>
        {history.fromUsers.map(({ id, name, email, imageURL }) => {
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

        <SectionTitleWrapper>
          <SectionTitle variant="body2" color="text.secondary">
            支払い日時
          </SectionTitle>
          <Divider />
        </SectionTitleWrapper>
        <Date variant="body2">{history.createdAt}</Date>
      </StyledDialogContent>
      <DialogActions>
        <Button onClick={close}>閉じる</Button>
      </DialogActions>
    </StyledDialog>
  );
};

const StyledDialog = styled(Dialog)`
  .MuiDialog-container {
    align-items: flex-end;
  }

  .MuiPaper-root {
    border-radius: 20px 20px 0 0;
    margin: 0;
    padding-top: 20px;
    width: 100%;
  }
`;

const StyledDialogContent = styled(DialogContent)`
  padding: 16px 24px;
`;

const SectionTitleWrapper = styled("div")`
  padding: 8px 0;
`;

const SectionTitle = styled(Typography)`
  padding: 8px 0;
`;

const Price = styled(Typography)`
  padding: 8px 0;
  text-align: right;
` as typeof Typography;

const Date = styled(Typography)`
  padding: 8px 0;
  text-align: right;
` as typeof Typography;

const MembersListItem = styled(ListItem)`
  padding: 0;
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
  justify-content: center;
  padding: 0 8px;
`;

export default HistoryDetailModal;