import * as React from "react";
import { ApolloError } from "@apollo/client";
import { styled } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { getAdjustmentsProps } from "../../../lib/apollo/api/getAdjustments";

const Adjustments: React.FC<Props> = ({ loading, error, data }) => {
  if (error) return <Message>{error.message}</Message>;
  if (loading || !data) return <Message>Loading</Message>;
  if (data.adjustments.length === 0) return <Message>¥---</Message>;

  return (
    <Wrapper>
      {data.adjustments.map(({ fromUser, toUser, amount }, index) => {
        return (
          <Item key={index}>
            <ProfileImageAvatar src={fromUser.imageURL} />
            <Typography
              sx={{ width: "80px", marginRight: "4px" }}
              variant="body2"
            >
              {fromUser.name}
            </Typography>
            <ArrowForwardIcon />
            <ProfileImageAvatar
              src={toUser.imageURL}
              sx={{ marginLeft: "4px" }}
            />
            <Typography sx={{ width: "80px" }} variant="body2">
              {toUser.name}
            </Typography>
            <Typography
              sx={{ width: "60px", marginLeft: "4px" }}
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

const ProfileImageAvatar = styled(Avatar)`
  width: 20px;
  height: 20px;
` as typeof Avatar;

const Message = styled("p")`
  text-align: center;
`;

type Props = {
  loading: boolean;
  error?: ApolloError;
  data?: getAdjustmentsProps;
};

export default Adjustments;
