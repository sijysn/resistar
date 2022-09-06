import * as React from "react";
import type { GetServerSideProps, NextPage } from "next";
import { useQuery } from "@apollo/client";
import nookies from "nookies";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import {
  getGroupsProps,
  getGroupsVarsProps,
  GET_GROUPS_WHERE_USER_HAS_BEEN_INVITED,
} from "../../lib/apollo/api/getGroupsWhereUserHasBeenInvited";
import {
  addApolloState,
  initializeApollo,
} from "../../lib/apollo/apollo-client";
import { getGroupsWhereUserHasBeenInvited } from "../../lib/apollo/server/getGroupsWhereUserHasBeenInvited";

const LandingPage: NextPage<ServerSideProps> = ({ cookies }) => {
  const getGroupsQueryVars = {
    userID: cookies["userID"],
  };
  const { loading, error, data } = useQuery<getGroupsProps, getGroupsVarsProps>(
    GET_GROUPS_WHERE_USER_HAS_BEEN_INVITED,
    {
      variables: getGroupsQueryVars,
      // networkStatusが変わるとコンポーネントが再レンダリングされる
      notifyOnNetworkStatusChange: true,
    }
  );

  if (loading || !data) {
    return <div>Loading</div>;
  }
  if (error) {
    return <div>{error.message}</div>;
  }
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      {data.groupsWhereUserHasBeenInvited.length == 0 && (
        <Box>招待されているグループはありません</Box>
      )}
      {data.groupsWhereUserHasBeenInvited.map(({ id, name, users }) => {
        return (
          <div>
            <Box key={id}>{name}</Box>
            {users.map((user) => {
              return <Box key={user.id}>{user.name}</Box>;
            })}
          </div>
        );
      })}
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (
  context
) => {
  const cookies = nookies.get(context);
  const apolloClient = initializeApollo(cookies["jwtToken"]);

  await getGroupsWhereUserHasBeenInvited(apolloClient, {
    userID: cookies["userID"],
  });

  return addApolloState(apolloClient, {
    props: {
      cookies,
    },
  });
};

type ServerSideProps = {
  cookies: { [key: string]: string };
};

export default LandingPage;
