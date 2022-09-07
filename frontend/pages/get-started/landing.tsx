import * as React from "react";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@apollo/client";
import nookies, { parseCookies } from "nookies";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import {
  getGroupsWhereUserHasBeenInvitedProps,
  getGroupsWhereUserHasBeenInvitedVarsProps,
  GET_GROUPS_WHERE_USER_HAS_BEEN_INVITED,
} from "../../lib/apollo/api/getGroupsWhereUserHasBeenInvited";
import {
  getGroupsProps,
  getGroupsVarsProps,
  GET_GROUPS,
} from "../../lib/apollo/api/getGroups";
import {
  addGroupProps,
  addGroupVarsProps,
  ADD_GROUP,
} from "../../lib/apollo/api/addGroup";
import {
  addApolloState,
  initializeApollo,
} from "../../lib/apollo/apollo-client";
import { getGroupsWhereUserHasBeenInvited } from "../../lib/apollo/server/getGroupsWhereUserHasBeenInvited";
import { getGroups } from "../../lib/apollo/server/getGroups";
import {
  LOGIN_GROUP,
  loginGroupProps,
  loginGroupVarsProps,
} from "../../lib/apollo/api/loginGroup";

const LandingPage: NextPage<ServerSideProps> = ({ cookies }) => {
  const [groupName, setGroupName] = React.useState("");
  const [message, setMessage] = React.useState("");

  const getGroupsWhereUserHasBeenInvitedQueryVars = {
    userID: cookies["userID"],
  };
  const {
    loading: getGroupWhereUserHasBeenInvitedLoading,
    error: getGroupWhereUserHasBeenInvitedError,
    data: getGroupWhereUserHasBeenInvitedData,
  } = useQuery<
    getGroupsWhereUserHasBeenInvitedProps,
    getGroupsWhereUserHasBeenInvitedVarsProps
  >(GET_GROUPS_WHERE_USER_HAS_BEEN_INVITED, {
    variables: getGroupsWhereUserHasBeenInvitedQueryVars,
    // networkStatusが変わるとコンポーネントが再レンダリングされる
    notifyOnNetworkStatusChange: true,
  });

  const getGroupsQueryVars = {
    userID: cookies["userID"],
  };
  const {
    loading: getGroupLoading,
    error: getGroupError,
    data: getGroupData,
  } = useQuery<getGroupsProps, getGroupsVarsProps>(GET_GROUPS, {
    variables: getGroupsQueryVars,
    // networkStatusが変わるとコンポーネントが再レンダリングされる
    notifyOnNetworkStatusChange: true,
  });
  const router = useRouter();

  const [
    addNewGroup,
    // { loading: addGroupLoading, error: addGroupError },
  ] = useMutation<addGroupProps, addGroupVarsProps>(ADD_GROUP);

  const addGroup = async () => {
    const addGroupQueryVars: addGroupVarsProps = {
      userID: cookies["userID"],
      groupName,
    };
    const { data } = await addNewGroup({
      variables: addGroupQueryVars,
    });
    if (!data) {
      setMessage("予期せぬエラーが起こりました");
      return;
    }
    const { errorMessage } = data.addGroup;
    if (errorMessage) {
      setMessage(errorMessage);
    }
  };

  const [login, { loading, error }] = useMutation<
    loginGroupProps,
    loginGroupVarsProps
  >(LOGIN_GROUP);

  const loginGroup = async (id: string) => {
    const loginGroupQueryVars: loginGroupVarsProps = {
      userID: cookies["userID"],
      groupID: id,
    };
    const { data } = await login({
      variables: loginGroupQueryVars,
    });
    if (!data) {
      setMessage("予期せぬエラーが起こりました");
      return;
    }
    const { message: loginMessage, success } = data.loginGroup;
    if (success) {
      router.push("/");
      return;
    }
    if (loginMessage) {
      setMessage(loginMessage);
    }
  };

  if (
    getGroupLoading ||
    getGroupWhereUserHasBeenInvitedLoading ||
    !getGroupData ||
    !getGroupWhereUserHasBeenInvitedData
  ) {
    return <div>Loading</div>;
  }
  if (getGroupError) {
    return (
      <div>
        {getGroupError.message}
        {message}
      </div>
    );
  }
  if (getGroupWhereUserHasBeenInvitedError) {
    return (
      <div>
        {getGroupWhereUserHasBeenInvitedError.message}
        {message}
      </div>
    );
  }
  if (message) {
    return <div>{message}</div>;
  }
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          label="グループ名"
          name="groupName"
          autoFocus
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={addGroup}
        >
          作成
        </Button>
      </Box>
      <Box>or</Box>
      {getGroupWhereUserHasBeenInvitedData.groupsWhereUserHasBeenInvited
        .length == 0 && <Box>招待されているグループはありません</Box>}
      {getGroupWhereUserHasBeenInvitedData.groupsWhereUserHasBeenInvited.map(
        ({ id, name, users }) => {
          return (
            <div key={id}>
              <Box>{name}</Box>
              {users.map((user) => {
                return <Box key={user.id}>{user.name}</Box>;
              })}
            </div>
          );
        }
      )}
      <Box>or</Box>
      {getGroupData.groups.length == 0 && (
        <Box>参加しているグループはありません</Box>
      )}
      {getGroupData.groups.map(({ id, name, users }) => {
        return (
          <div key={id} onClick={() => loginGroup(id)}>
            <Box>{name}</Box>
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

  await getGroups(apolloClient, {
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
