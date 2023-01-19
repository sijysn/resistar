import * as React from "react";
import Link from "next/link";
import dayjs from "dayjs";
import { styled } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

const Header: React.FC<Props> = ({ yearAndMonth, menuItems }) => {
  const year = dayjs(yearAndMonth).format("YYYY");
  const month = dayjs(yearAndMonth).format("M");

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const toggleMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const closeMenu = () => {
    setAnchorEl(null);
  };

  return (
    <Wrapper>
      <Link href={`/histories/${yearAndMonth}`}>
        <IconButton size="large">
          <ArrowBackIcon />
        </IconButton>
      </Link>
      <div>
        {year}年{month}月
      </div>
      <IconButton
        size="large"
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={toggleMenu}
      >
        <MoreHorizIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={closeMenu}>
        {menuItems.map(({ title, handleClick }, index) => {
          const _handleClick = () => {
            handleClick();
            closeMenu();
          };
          return (
            <MenuItem key={index} onClick={_handleClick}>
              {title}
            </MenuItem>
          );
        })}
      </Menu>
    </Wrapper>
  );
};

const Wrapper = styled("div")`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 425px;
`;

type Props = {
  yearAndMonth: string;
  menuItems: {
    title: string;
    handleClick: () => void;
  }[];
};

export default Header;
