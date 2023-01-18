import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { styled } from "@mui/material";
import Typography from "@mui/material/Typography";
import HistoryDetailModalSectionTitle from "./HistoryDetailModalSectionTitle";
import MemberItem from "../common/MemberItem";
import { HistoryProps } from "../../lib/apollo/api/getHistories";
import { DEFAULT_PROFILE_IMAGE_URL } from "../../lib/constants";

type ModalProps = {
  isOpen: boolean;
  close: () => void;
  history: HistoryProps;
  handleImageURL?: (url: string) => void;
};

const HistoryDetailModal: React.FC<ModalProps> = ({
  isOpen,
  close,
  history,
  handleImageURL,
}) => {
  return (
    <StyledDialog open={isOpen} keepMounted onClose={close}>
      <DialogTitle component="h1">
        <Typography component="span" variant="h6">
          {history.title}
        </Typography>
      </DialogTitle>

      <StyledDialogContent>
        <HistoryDetailModalSectionTitle title="合計額" />
        <Price>¥{history.price.toLocaleString()}</Price>

        <HistoryDetailModalSectionTitle title="1人あたりの支払い額" />
        <Price>
          ¥{(history.price / history.toUsers.length).toLocaleString()}
        </Price>

        <HistoryDetailModalSectionTitle title="購入者" />
        {history.fromUsers.map(({ id, name, email, imageURL }) => {
          return (
            <MemberItem
              key={id}
              name={name}
              email={email}
              imageURL={imageURL || DEFAULT_PROFILE_IMAGE_URL}
              handleImageURL={handleImageURL}
            />
          );
        })}

        <HistoryDetailModalSectionTitle title="負担者" />
        {history.toUsers.map(({ id, name, email, imageURL }) => {
          return (
            <MemberItem
              key={id}
              name={name}
              email={email}
              imageURL={imageURL || DEFAULT_PROFILE_IMAGE_URL}
              handleImageURL={handleImageURL}
            />
          );
        })}

        <HistoryDetailModalSectionTitle title="支払い日時" />
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

const Price = styled(Typography)`
  padding: 8px 0;
  text-align: right;
` as typeof Typography;

const Date = styled(Typography)`
  padding: 8px 0;
  text-align: right;
` as typeof Typography;

export default HistoryDetailModal;
