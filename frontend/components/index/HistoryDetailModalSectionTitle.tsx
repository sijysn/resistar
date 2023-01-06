import * as React from "react";
import { styled } from "@mui/material";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

type Props = {
  title: string;
};

const HistoryDetailModalSectionTitle: React.FC<Props> = ({ title }) => {
  return (
    <Wrapper>
      <Title variant="body2" color="text.secondary">
        {title}
      </Title>
      <Divider />
    </Wrapper>
  );
};

const Wrapper = styled("div")`
  padding: 8px 0;
`;

const Title = styled(Typography)`
  padding: 8px 0;
`;

export default HistoryDetailModalSectionTitle;
