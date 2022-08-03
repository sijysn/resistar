import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";

type Props = {
  label: string;
  items: string[];
  handleChange: (
    event: SelectChangeEvent<string>,
    child: React.ReactNode
  ) => void;
  selectedItem?: string;
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

const Selector: React.FC<Props> = ({
  label,
  items,
  handleChange,
  selectedItem,
  className,
}) => {
  return (
    <FormControl fullWidth variant="standard" className={className}>
      <InputLabel shrink>{label}</InputLabel>
      <Select
        value={selectedItem}
        onChange={handleChange}
        renderValue={(selected) => selected}
        MenuProps={MenuProps}
      >
        {items.map((item) => (
          <MenuItem key={item} value={item}>
            <Checkbox checked={item === selectedItem} />
            <ListItemText primary={item} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default Selector;
