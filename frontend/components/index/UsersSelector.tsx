import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import { UserProps } from "../../lib/apollo/api/getUser";

type Props = {
  label: string;
  selectableUsers: UserProps[];
  setSelectedUsers: (value: React.SetStateAction<UserProps[]>) => void;
  selectedUsers: UserProps[];
  className?: string;
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const getIsUserSelected = (selectedUsers: UserProps[], userId: string) =>
  selectedUsers.map((selectedUser) => selectedUser.id).includes(userId);

const UsersSelector: React.FC<Props> = ({
  label,
  selectableUsers,
  setSelectedUsers,
  selectedUsers,
  className,
}) => {
  const handleChange = (e: SelectChangeEvent<string[]>) => {
    const { value } = e.target;
    setSelectedUsers(
      typeof value === "string"
        ? selectedUsers
        : selectableUsers.filter(({ id }) => value.includes(id))
    );
  };

  return (
    <FormControl fullWidth variant="standard" className={className}>
      <InputLabel shrink>{label}</InputLabel>
      <Select
        multiple
        value={selectedUsers.map((selectedUser) => selectedUser.id)}
        onChange={handleChange}
        renderValue={(_) => selectedUsers.map(({ name }) => name).join(", ")}
        MenuProps={MenuProps}
      >
        {selectableUsers.map((selectableUser) => {
          const { id, name } = selectableUser;
          return (
            <MenuItem key={id} value={id}>
              <Checkbox checked={getIsUserSelected(selectedUsers, id)} />
              <ListItemText primary={name} />
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default UsersSelector;
