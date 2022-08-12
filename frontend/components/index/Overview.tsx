import * as React from "react";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import dayjs from "dayjs";
import { getHistoriesProps } from "../../lib/api/getHistories";
import {
  GET_USERS,
  getUsersProps,
  getUsersVarsProps,
} from "../../lib/api/getUsers";

type Props = {
  yearAndMonth: string;
  historiesData?: getHistoriesProps;
};

const getTotal = (historiesData?: getHistoriesProps) => {
  if (historiesData) {
    return historiesData.histories.reduce((prev, { price }) => prev + price, 0);
  }
  return 0;
};

const userTotal = 3000;

const Overview: React.FC<Props> = ({ yearAndMonth, historiesData }) => {
  const [year, month] = dayjs(yearAndMonth).format("YYYY-M").split("-");
  const previousYearAndMonth = dayjs(yearAndMonth)
    .subtract(1, "M")
    .format("YYYY-MM");
  const nextYearAndMonth = dayjs(yearAndMonth).add(1, "M").format("YYYY-MM");
  const getUsersQueryVars = {
    groupID: "1",
  };
  const { loading, error, data } = useQuery<getUsersProps, getUsersVarsProps>(
    GET_USERS,
    {
      variables: getUsersQueryVars,
      notifyOnNetworkStatusChange: true,
    }
  );
  if (loading || !data) return <div>loading</div>;
  if (error) return <div>{error.message}</div>;
  if (data.users.length === 0) return <div>メンバーがいません</div>;
  return (
    <Wrapper>
      <OverviewHeader>
        <Link href={`/history/${previousYearAndMonth}`}>
          <IconButton size="large">
            <ChevronLeftIcon />
          </IconButton>
        </Link>
        <div>
          {year}年{month}月のあなたの支払い
        </div>
        <Link href={`/history/${nextYearAndMonth}`}>
          <IconButton size="large">
            <ChevronRightIcon />
          </IconButton>
        </Link>
      </OverviewHeader>
      <Total>
        ¥{userTotal.toLocaleString()}
        <GroupTotal> / ¥{getTotal(historiesData).toLocaleString()}</GroupTotal>
      </Total>
      <Members>
        <MembersCount>メンバー({data.users.length})</MembersCount>
        <MemberList>
          {data.users.map(({ id, imageURL }) => (
            <Member key={id} src={imageURL} />
          ))}
        </MemberList>
      </Members>
    </Wrapper>
  );
};

const Wrapper = styled("div")(
  ({ theme }) => `
  background-color: ${theme.palette.primary.main};
  height: 200px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
`
);

const OverviewHeader = styled("div")`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 10px;
`;

const Total = styled("div")`
  font-size: 2rem;
`;

const GroupTotal = styled("span")`
  font-size: 1rem;
`;

const Members = styled("div")`
  display: flex;
  flex-direction: column;
`;

const MembersCount = styled("div")`
  text-align: center;
  font-size: 12px;
`;

const MemberList = styled("div")`
  display: flex;
`;

const Member = styled(Avatar)`
  width: 40px;
  height: 40px;
` as typeof Avatar;

export default Overview;
