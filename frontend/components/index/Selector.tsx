import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";

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

const types = ["日用品", "交通費", "食費", "ショッピング", "その他"];

const Selector: React.FC<{ label: string; className?: string }> = ({
  label,
  className,
}) => {
  const [type, setType] = React.useState<string>("日用品");

  const handleChange = (event: SelectChangeEvent<typeof type>) => {
    const {
      target: { value },
    } = event;
    setType(value);
  };

  return (
    <FormControl fullWidth variant="standard" className={className}>
      <InputLabel shrink>{label}</InputLabel>
      <Select
        value={type}
        onChange={handleChange}
        renderValue={(selected) => selected}
        MenuProps={MenuProps}
      >
        {types.map((item) => (
          <MenuItem key={item} value={item}>
            <Checkbox checked={item === type} />
            <ListItemText primary={item} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default Selector;
