import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { styled } from "@mui/material";

type Props = {
  personalBalance: number;
};

export const Sign: React.FC<Props> = ({ personalBalance }) => {
  if (personalBalance < 0) {
    return (
      <IconWrapper>
        <RemoveIcon />
      </IconWrapper>
    );
  }
  return (
    <IconWrapper>
      <AddIcon />
    </IconWrapper>
  );
};

const IconWrapper = styled("span")`
  margin-right: 8px;
`;
