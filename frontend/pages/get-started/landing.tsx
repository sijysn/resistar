import * as React from "react";
import type { GetServerSideProps, NextPage } from "next";
import nookies from "nookies";
import {
  addApolloState,
  initializeApollo,
} from "../../lib/apollo/apollo-client";
import { getGroupsWhereUserHasBeenInvited } from "../../lib/apollo/server/getGroupsWhereUserHasBeenInvited";
import { getGroups } from "../../lib/apollo/server/getGroups";
import Landing from "../../components/get-started/landing/Landing";

const LandingPage: NextPage<ServerSideProps> = (props) => {
  return <Landing {...props} />;
};

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (
  context
) => {
  const cookies = nookies.get(context);
  const apolloClient = initializeApollo(cookies["jwtToken"]);

  await getGroupsWhereUserHasBeenInvited(apolloClient, {
    userID: cookies["userID"],
  });

  await getGroups(apolloClient, {
    userID: cookies["userID"],
  });

  return addApolloState(apolloClient, {
    props: {
      cookies,
    },
  });
};

export type ServerSideProps = {
  cookies: { [key: string]: string };
};

export default LandingPage;
