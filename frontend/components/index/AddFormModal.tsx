import * as React from "react";
import { useMutation } from "@apollo/client";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { SelectChangeEvent } from "@mui/material/Select";
import { styled } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import Selector from "./Selector";
import UsersSelector, { UserProps } from "./UsersSelector";
import {
  ADD_HISTORY,
  addHistoryProps,
  addHistoryVarsProps,
  DisplayedType,
  DisplayedTypes,
  DISPLAYED_TYPE_DIARY,
  TypesMaster,
} from "../../lib/api/addHistory";

type ModalProps = {
  isOpen: boolean;
  close: () => void;
};

const users = [
  { id: "1", name: "せーじ" },
  { id: "2", name: "もつ" },
  { id: "3", name: "かんた" },
];

const Transition = React.forwardRef(function TransitionComponent(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type initializeValuesProps = {
  title: string;
  type: DisplayedType;
  price: number;
  fromUsers: UserProps[];
  toUsers: UserProps[];
};

const initialValues: initializeValuesProps = {
  title: "",
  type: DISPLAYED_TYPE_DIARY,
  price: 0,
  fromUsers: [],
  toUsers: [],
};

const AddFormModal: React.FC<ModalProps> = ({ isOpen, close }) => {
  const [title, setTitle] = React.useState(initialValues["title"]);
  const [type, setType] = React.useState(initialValues["type"]);
  const handleSelectorChange = (e: SelectChangeEvent<string>) => {
    setType(e.target.value as DisplayedType);
  };
  const [price, setPrice] = React.useState(initialValues["price"]);
  const [fromUsers, setFromUsers] = React.useState<UserProps[]>(
    initialValues["fromUsers"]
  );
  const [toUsers, setToUsers] = React.useState<UserProps[]>(
    initialValues["toUsers"]
  );

  const [add, { loading, error }] = useMutation<
    addHistoryProps,
    addHistoryVarsProps
  >(ADD_HISTORY);

  const addHistory = () => {
    const addHistoryQueryVars: addHistoryVarsProps = {
      groupID: "1",
      title: title,
      type: TypesMaster[type],
      price: Number(price),
      fromUserIds: fromUsers.map(({ id }) => id),
      toUserIds: toUsers.map(({ id }) => id),
    };
    console.log(addHistoryQueryVars);
    add({ variables: addHistoryQueryVars });
    initializeValues();
  };

  const initializeValues = () => {
    setTitle(initialValues["title"]);
    setType(initialValues["type"]);
    setPrice(initialValues["price"]);
    setFromUsers(initialValues["fromUsers"]);
    setToUsers(initialValues["toUsers"]);
  };

  if (loading) return <div>Submitting...</div>;
  if (error) return <div>Submission error! {error.message}</div>;

  return (
    <StyledDialog
      open={isOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={close}
    >
      <DialogTitle>新しい支払い</DialogTitle>
      <StyledDialogContent>
        <StyledTextField
          label="タイトル"
          variant="standard"
          value={title}
          fullWidth
          InputProps={{ placeholder: "洗剤の購入" }}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(e: any) => setTitle(e.target.value)}
        />
        <StyledSelector
          label="タイプ"
          items={DisplayedTypes}
          handleChange={handleSelectorChange}
          selectedItem={type}
        />
        <StyledTextField
          label="支払い額"
          variant="standard"
          value={price}
          InputProps={{
            startAdornment: <InputAdornment position="start">¥</InputAdornment>,
          }}
          fullWidth
          onChange={(e: any) => setPrice(e.target.value)}
        />
        <StyledUsersSelector
          label="購入者"
          selectableUsers={users}
          setSelectedUsers={setFromUsers}
          selectedUsers={fromUsers}
        />
        <UsersSelector
          label="負担者"
          selectableUsers={users}
          setSelectedUsers={setToUsers}
          selectedUsers={toUsers}
        />
      </StyledDialogContent>
      <DialogActions>
        <Button onClick={close}>キャンセル</Button>
        <Button
          onClick={() => {
            addHistory();
            close();
          }}
        >
          追加
        </Button>
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

const StyledDialogContent = styled(DialogContent)`
  padding: 16px 24px;
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
