import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { styled } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import Selector from "./Selector";
import UsersSelector from "./UsersSelector";

type ModalProps = {
  isOpen: boolean;
  close: () => void;
};

const Transition = React.forwardRef(
  (
    props: TransitionProps & {
      children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
  ) => {
    return <Slide direction="up" ref={ref} {...props} />;
  }
);

const AddFormModal: React.FC<ModalProps> = ({ isOpen, close }) => {
  return (
    <StyledDialog
      open={isOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={close}
    >
      <DialogTitle>新しい支払い</DialogTitle>
      <DialogContent>
        <StyledDialogContentText>
          <StyledTextField
            label="タイトル"
            variant="standard"
            fullWidth
            InputProps={{ placeholder: "洗剤の購入" }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <StyledSelector label="タイプ" />
          <StyledTextField
            label="支払い額"
            variant="standard"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">¥</InputAdornment>
              ),
            }}
            fullWidth
          />
          <StyledUsersSelector label="請求元" />
          <UsersSelector label="請求先" />
        </StyledDialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>キャンセル</Button>
        <Button onClick={close}>追加</Button>
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
    padding: 20px 0;
  }
`;

const StyledDialogContentText = styled(DialogContentText)`
  padding: 16px 0;
`;

const StyledTextField = styled(TextField)`
  margin-bottom: 32px;
` as typeof TextField;

const StyledSelector = styled(Selector)`
  margin-bottom: 32px;
` as typeof Selector;

const StyledUsersSelector = styled(UsersSelector)`
  margin-bottom: 32px;
` as typeof UsersSelector;

export default AddFormModal;
