import * as React from "react";
import Link from "next/link";
import { ApolloError, useQuery } from "@apollo/client";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import dayjs from "dayjs";
import {
  getUsersProps,
  getUsersVarsProps,
  GET_USERS,
} from "../../lib/apollo/api/getUsers";
import { getAmountsProps } from "../../lib/apollo/api/getAmounts";
import { Sign } from "./Sign";

type Props = {
  yearAndMonth: string;
  amountsData?: getAmountsProps;
  amountsLoading: boolean;
  amountsError?: ApolloError;
  cookies: { [key: string]: string };
};

const Overview: React.FC<Props> = ({
  yearAndMonth,
  amountsData,
  amountsLoading,
  amountsError,
  cookies,
}) => {
  const [year, month] = dayjs(yearAndMonth).format("YYYY-M").split("-");
  const previousYearAndMonth = dayjs(yearAndMonth)
    .subtract(1, "M")
    .format("YYYY-MM");
  const nextYearAndMonth = dayjs(yearAndMonth).add(1, "M").format("YYYY-MM");
  const getUsersQueryVars = {
    groupID: cookies["groupID"],
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
        <Link href={`/histories/${previousYearAndMonth}`}>
          <IconButton size="large">
            <ChevronLeftIcon />
          </IconButton>
        </Link>
        <div>
          {year}年{month}月
        </div>
        <Link href={`/histories/${nextYearAndMonth}`}>
          <IconButton size="large">
            <ChevronRightIcon />
          </IconButton>
        </Link>
      </OverviewHeader>
      <Link href={`/histories/overview/${yearAndMonth}`}>
        <OverviewBody>
          <Amounts>
            <PersonalBalance>
              {!amountsLoading &&
              amountsData &&
              amountsData.amounts.personalBalance ? (
                <>
                  <Sign personalBalance={amountsData.amounts.personalBalance} />
                  ¥
                  {Math.abs(
                    amountsData.amounts.personalBalance
                  ).toLocaleString()}
                </>
              ) : (
                "¥---"
              )}
            </PersonalBalance>
            <GroupTotal>
              グループ支出 ¥
              {!amountsLoading && amountsData && amountsData.amounts.groupTotal
                ? amountsData.amounts.groupTotal.toLocaleString()
                : "---"}
            </GroupTotal>
          </Amounts>
          <Members>
            <MembersCount>
              メンバー(
              {!usersLoading && usersData ? usersData.users.length : 0})
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
        </OverviewBody>
      </Link>
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

const OverviewBody = styled("a")`
  width: 100%;
  display: block;
`;

const Amounts = styled("div")`
  text-align: center;
  padding: 16px 0;
`;

const PersonalBalance = styled("div")`
  font-size: 2rem;
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
  justify-content: center;
`;

const Member = styled(Avatar)`
  width: 40px;
  height: 40px;
  margin: 4px;
` as typeof Avatar;

export default Overview;
