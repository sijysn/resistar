import * as React from "react";
import Link from "next/link";
import dayjs from "dayjs";
import { styled } from "@mui/material";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const Adjustment: React.FC = () => {
  return (
    <Wrapper>
      {/* {fromUser} */}
      せいじ
      <ArrowForwardIcon />
      {/* {toUser} */}
      もっちゃん
      {/* {amount} */}
      {(1000).toLocaleString()}
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

export default Adjustment;
