import * as React from "react";
import Link from "next/link";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import dayjs from "dayjs";

type Props = {
  yearAndMonth: string;
};

const data = {
  userTotal: 3000,
  groupTotal: 12000,
  yearAndMonth: "2022-07",
  members: [
    { id: 1, name: "seiji" },
    { id: 2, name: "motsu" },
    { id: 3, name: "kanta" },
  ],
};

const Overview: React.FC<Props> = ({ yearAndMonth }) => {
  const { userTotal, groupTotal, members } = data;
  const [year, month] = dayjs(yearAndMonth).format("YYYY-M").split("-");
  const previousYearAndMonth = dayjs(yearAndMonth)
    .subtract(1, "M")
    .format("YYYY-MM");
  const nextYearAndMonth = dayjs(yearAndMonth).add(1, "M").format("YYYY-MM");
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
        <GroupTotal> / ¥{groupTotal.toLocaleString()}</GroupTotal>
      </Total>
      <Members>
        <MembersCount>メンバー({members.length})</MembersCount>
        <MemberList>
          {members.map(({ id }) => (
            <Member key={id} src={""} />
          ))}
        </MemberList>
      </Members>
    </Wrapper>
  );
};

const Wrapper = styled("div")`
  background-color: #f68989;
  height: 200px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
`;

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
