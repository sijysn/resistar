import * as React from "react";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@apollo/client";
import nookies from "nookies";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import {
  getGroupsProps,
  getGroupsVarsProps,
  GET_GROUPS_WHERE_USER_HAS_BEEN_INVITED,
} from "../../lib/apollo/api/getGroupsWhereUserHasBeenInvited";
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

const LandingPage: NextPage<ServerSideProps> = ({ cookies }) => {
  const [groupName, setGroupName] = React.useState("");
  const [message, setMessage] = React.useState("");

  const getGroupsQueryVars = {
    userID: cookies["userID"],
  };
  const {
    loading: getGroupLoading,
    error: getGroupError,
    data: getGroupData,
  } = useQuery<getGroupsProps, getGroupsVarsProps>(
    GET_GROUPS_WHERE_USER_HAS_BEEN_INVITED,
    {
      variables: getGroupsQueryVars,
      // networkStatusが変わるとコンポーネントが再レンダリングされる
      notifyOnNetworkStatusChange: true,
    }
  );
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

  // React.useEffect(() => {
  //   if (cookies["groupID"]) {
  //     router.reload();
  //   }
  // }, [cookies["groupID"]]);

  if (getGroupLoading || !getGroupData) {
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
      {getGroupData.groupsWhereUserHasBeenInvited.length == 0 && (
        <Box>招待されているグループはありません</Box>
      )}
      {getGroupData.groupsWhereUserHasBeenInvited.map(({ id, name, users }) => {
        return (
          <div key={id}>
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
