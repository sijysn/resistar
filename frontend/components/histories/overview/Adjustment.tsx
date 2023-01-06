import * as React from "react";
import dayjs from "dayjs";
import { useQuery } from "@apollo/client";
import { styled } from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {
  getAdjustmentsProps,
  getAdjustmentsVarsProps,
  GET_ADJUSTMENTS,
} from "../../../lib/apollo/api/getAdjustment";

const Adjustment: React.FC<Props> = ({ yearAndMonth, cookies }) => {
  const year = dayjs(yearAndMonth).format("YYYY");
  const month = dayjs(yearAndMonth).format("M");
  const getAdjustmentQueryVars = {
    groupID: cookies["groupID"],
    year,
    month,
  };
  const { loading, error, data } = useQuery<
    getAdjustmentsProps,
    getAdjustmentsVarsProps
  >(GET_ADJUSTMENTS, {
    variables: getAdjustmentQueryVars,
    notifyOnNetworkStatusChange: true,
  });
  if (error) return <Message>{error.message}</Message>;
  if (loading || !data) return <Message>Loading</Message>;
  if (data.adjustments.length === 0) return <Message>¥---</Message>;

  return (
    <Wrapper>
      {data.adjustments.map(({ fromUser, toUser, amount }, index) => {
        return (
          <Item key={index}>
            <Typography
              sx={{ width: "80px", marginRight: "8px" }}
              variant="body2"
            >
              {fromUser.name}
            </Typography>
            <ArrowForwardIcon />
            <Typography
              sx={{ width: "80px", marginLeft: "8px" }}
              variant="body2"
            >
              {toUser.name}
            </Typography>
            <Typography
              sx={{ width: "60px", marginLeft: "8px" }}
              variant="body2"
            >
              ¥{amount.toLocaleString()}
            </Typography>
          </Item>
        );
      })}
    </Wrapper>
  );
};

const Wrapper = styled("div")`
  width: 100%;
  padding: 16px;
`;
const Item = styled("div")`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 16px 0;
`;

const Message = styled("p")`
  text-align: center;
`;

type Props = {
  yearAndMonth: string;
  cookies: { [key: string]: any };
};

export default Adjustment;
