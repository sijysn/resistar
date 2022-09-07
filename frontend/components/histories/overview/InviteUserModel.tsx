import * as React from "react";
import { useMutation } from "@apollo/client";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import Box from "@mui/material/Box";
import {
  inviteUserToGroupProps,
  inviteUserToGroupVarsProps,
  INVITE_USER_TO_GROUP,
} from "../../../lib/apollo/api/inviteUserToGroup";

type ModalProps = {
  isOpen: boolean;
  close: () => void;
  onAdd: () => void;
  cookies: { [key: string]: string };
};

const Transition = React.forwardRef(function TransitionComponent(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const InviteUserModal: React.FC<ModalProps> = ({
  isOpen,
  close,
  onAdd,
  cookies,
}) => {
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");

  const [inviteUser, { loading, error }] = useMutation<
    inviteUserToGroupProps,
    inviteUserToGroupVarsProps
  >(INVITE_USER_TO_GROUP);

  const inviteUserToGroup = async () => {
    const inviteUserToGroupQueryVars: inviteUserToGroupVarsProps = {
      groupID: cookies["groupID"],
      email,
    };
    const { data } = await inviteUser({
      variables: inviteUserToGroupQueryVars,
    });
    if (!data) {
      setMessage("予期せぬエラーが起こりました");
      return;
    }
    const { message } = data.inviteUserToGroup;
    if (message === "招待メールを送りました") {
      setEmail("");
      close();
    }
    if (message) {
      setMessage(message);
      return;
    }
  };

  React.useEffect(() => {
    onAdd();
  }, [loading]);

  return (
    <StyledDialog
      open={isOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={close}
    >
      <DialogTitle>新しいメンバー</DialogTitle>
      {error && <Message>Submission error! {error.message}</Message>}
      {message && <Message>{message}</Message>}
      <StyledDialogContent>
        <StyledTextField
          label="メールアドレス"
          variant="standard"
          value={email}
          fullWidth
          InputProps={{ placeholder: "resistar@resistar.com" }}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(e: any) => setEmail(e.target.value)}
        />
      </StyledDialogContent>
      <DialogActions>
        <Button onClick={close}>キャンセル</Button>
        <Button onClick={inviteUserToGroup}>招待</Button>
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
    width: 100%;
  }
`;

const Message = styled("div")`
  padding: 16px 24px;
`;

const StyledDialogContent = styled(DialogContent)`
  padding: 16px 24px;
`;

const StyledTextField = styled(TextField)`
  margin-bottom: 32px;
` as typeof TextField;

export default InviteUserModal;
