import * as React from "react";
import Link from "next/link";
import { ApolloError, useQuery } from "@apollo/client";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import dayjs from "dayjs";
import { getHistoriesProps } from "../../lib/api/getHistories";
import {
  GET_USERS,
  getUsersProps,
  getUsersVarsProps,
} from "../../lib/api/getUsers";
import { getAmountsProps } from "../../lib/api/getAmounts";

type Props = {
  yearAndMonth: string;
  historiesData?: getHistoriesProps;
  amountsLoading: boolean;
  amountsError?: ApolloError;
  amountsData?: getAmountsProps;
  loadingMoreAmounts: boolean;
};

const getTotal = (historiesData?: getHistoriesProps) => {
  if (historiesData) {
    return historiesData.histories.reduce((prev, { price }) => prev + price, 0);
  }
  return 0;
};

const getSign = (amountsData?: getAmountsProps) => {
  if (!amountsData) {
    return "";
  }
  if (amountsData.amounts.personalBalance < 0) {
    return (
      <Sign>
        <RemoveIcon />
      </Sign>
    );
  }
  return (
    <Sign>
      <AddIcon />
    </Sign>
  );
};

const Overview: React.FC<Props> = ({
  yearAndMonth,
  historiesData,
  amountsLoading,
  amountsError,
  amountsData,
  loadingMoreAmounts,
}) => {
  const [year, month] = dayjs(yearAndMonth).format("YYYY-M").split("-");
  const previousYearAndMonth = dayjs(yearAndMonth)
    .subtract(1, "M")
    .format("YYYY-MM");
  const nextYearAndMonth = dayjs(yearAndMonth).add(1, "M").format("YYYY-MM");
  const getUsersQueryVars = {
    groupID: "1",
  };
  const {
    loading: usersLoading,
    error: usersError,
    data: usersData,
  } = useQuery<getUsersProps, getUsersVarsProps>(GET_USERS, {
    variables: getUsersQueryVars,
    notifyOnNetworkStatusChange: true,
  });
  if (usersError) return <div>{usersError.message}</div>;
  if (amountsError) return <div>{amountsError.message}</div>;
  return (
    <Wrapper>
      <OverviewHeader>
        <Link href={`/history/${previousYearAndMonth}`}>
          <IconButton size="large">
            <ChevronLeftIcon />
          </IconButton>
        </Link>
        <div>
          {year}年{month}月
        </div>
        <Link href={`/history/${nextYearAndMonth}`}>
          <IconButton size="large">
            <ChevronRightIcon />
          </IconButton>
        </Link>
      </OverviewHeader>
      <Amounts>
        <PersonalBalance>
          {getSign(amountsData)}¥
          {amountsData && amountsData.amounts.personalBalance
            ? Math.abs(amountsData.amounts.personalBalance).toLocaleString()
            : "---"}
        </PersonalBalance>
        <GroupTotal>
          グループ支出 ¥{getTotal(historiesData).toLocaleString()}
        </GroupTotal>
      </Amounts>
      <Members>
        <MembersCount>
          メンバー({!usersLoading && usersData ? usersData.users.length : 0})
        </MembersCount>
        <MemberList>
          {!usersLoading && usersData ? (
            usersData.users.map(({ id, imageURL }) => (
              <Member key={id} src={imageURL} />
            ))
          ) : (
            <Member src="" />
          )}
        </MemberList>
      </Members>
    </Wrapper>
  );
};

const Wrapper = styled("div")(
  ({ theme }) => `
  background-color: ${theme.palette.primary.main};
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  color: #fff;
  padding: 8px;
`
);

const OverviewHeader = styled("div")`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const Amounts = styled("div")`
  text-align: center;
  padding: 16px 0;
`;

const PersonalBalance = styled("div")`
  font-size: 2rem;
`;

const Sign = styled("span")`
  margin-right: 8px;
`;

const GroupTotal = styled("div")`
  font-size: 1rem;
`;

const Members = styled("div")`
  padding-top: 8px;
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
  margin: 4px;
` as typeof Avatar;

export default Overview;
