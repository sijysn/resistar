import * as React from "react";
import { Avatar, styled } from "@mui/material";

const data = {
  userTotal: 3000,
  groupTotal: 12000,
  yearAndMonth: "2022-07",
  members: [
    { id: 1, username: "seiji", imageUrl: "" },
    { id: 2, username: "motsu", imageUrl: "" },
    { id: 3, username: "kanta", imageUrl: "" },
  ],
};

const Overview = () => {
  const { userTotal, groupTotal, yearAndMonth, members } = data;
  const [year, month] = yearAndMonth.split("-");
  return (
    <Wrapper>
      <p>
        {year}年{month}月のあなたの支払い
      </p>
      <Total>
        ¥{userTotal.toLocaleString()}
        <GroupTotal> / ¥{groupTotal.toLocaleString()}</GroupTotal>
      </Total>
      <Members>
        <MembersCount>メンバー({members.length})</MembersCount>
        <MemberList>
          {members.map(({ id, imageUrl }) => (
            <Member key={id} src={imageUrl} />
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
