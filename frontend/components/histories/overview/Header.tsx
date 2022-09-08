import * as React from "react";
import Link from "next/link";
import dayjs from "dayjs";
import { styled } from "@mui/material";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Header: React.FC<Props> = ({ yearAndMonth, handleClick }) => {
  const year = dayjs(yearAndMonth).format("YYYY");
  const month = dayjs(yearAndMonth).format("M");

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
      <StyledButton onClick={handleClick}>招待</StyledButton>
    </Wrapper>
  );
};

const Wrapper = styled("div")`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const StyledButton = styled(Button)(
  ({ theme }) => `
  color: ${theme.palette.common.white};
  min-width: unset;
  width: 48px
`
);

type Props = {
  yearAndMonth: string;
  handleClick: () => void;
};

export default Header;
