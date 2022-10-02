import * as React from "react";
import { useQuery, useMutation } from "@apollo/client";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import {
  getGroupsWhereUserHasBeenInvitedProps,
  getGroupsWhereUserHasBeenInvitedVarsProps,
  GET_GROUPS_WHERE_USER_HAS_BEEN_INVITED,
} from "../../../lib/apollo/api/getGroupsWhereUserHasBeenInvited";
import {
  getGroupsProps,
  getGroupsVarsProps,
  GET_GROUPS,
} from "../../../lib/apollo/api/getGroups";
import {
  addGroupProps,
  addGroupVarsProps,
  ADD_GROUP,
} from "../../../lib/apollo/api/addGroup";
import {
  LOGIN_GROUP,
  loginGroupProps,
  loginGroupVarsProps,
} from "../../../lib/apollo/api/loginGroup";
import {
  JOIN_GROUP,
  joinGroupProps,
  joinGroupVarsProps,
} from "../../../lib/apollo/api/joinGroup";
import { ServerSideProps } from "../../../pages/get-started/landing";
import Group from "./Group";
import { Typography } from "@mui/material";

const Landing: React.FC<ServerSideProps> = ({ cookies }) => {
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
    const { message: addGroupMessage, success } = data.addGroup;
    if (success) {
      window.location.href = "/";
      return;
    }
    if (addGroupMessage) {
      setMessage(addGroupMessage);
    }
  };

  const [login] = useMutation<loginGroupProps, loginGroupVarsProps>(
    LOGIN_GROUP
  );
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
      window.location.href = "/";
      return;
    }
    if (loginMessage) {
      setMessage(loginMessage);
    }
  };

  const [join] = useMutation<joinGroupProps, joinGroupVarsProps>(JOIN_GROUP);
  const joinGroup = async (id: string) => {
    const joinGroupQueryVars: joinGroupVarsProps = {
      userID: cookies["userID"],
      groupID: id,
    };
    const { data } = await join({
      variables: joinGroupQueryVars,
    });
    if (!data) {
      setMessage("予期せぬエラーが起こりました");
      return;
    }
    const { message: joinMessage, success } = data.joinGroup;
    if (success) {
      window.location.href = "/";
      return;
    }
    if (joinMessage) {
      setMessage(joinMessage);
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
    return <div>{getGroupError.message}</div>;
  }
  if (getGroupWhereUserHasBeenInvitedError) {
    return <div>{getGroupWhereUserHasBeenInvitedError.message}</div>;
  }
  if (message) {
    return <div>{message}</div>;
  }
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Typography variant="h6" gutterBottom sx={{ marginTop: "32px" }}>
        新しいグループを作成する
      </Typography>
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
          sx={{ marginTop: "4px" }}
          onClick={addGroup}
        >
          <Typography color="common.white">作成</Typography>
        </Button>
      </Box>
      <Typography variant="h6" gutterBottom sx={{ marginTop: "32px" }}>
        招待を承諾する
      </Typography>
      {getGroupWhereUserHasBeenInvitedData.groupsWhereUserHasBeenInvited
        .length == 0 ? (
        <Box>招待されているグループはありません</Box>
      ) : (
        <>
          {getGroupWhereUserHasBeenInvitedData.groupsWhereUserHasBeenInvited.map(
            ({ id, name, users }) => {
              return (
                <Group
                  key={id}
                  id={id}
                  name={name}
                  users={users}
                  handleClick={joinGroup}
                />
              );
            }
          )}
        </>
      )}
      <Typography variant="h6" gutterBottom sx={{ marginTop: "32px" }}>
        あなたのグループ
      </Typography>
      {getGroupData.groups.length == 0 ? (
        <Typography variant="subtitle2">
          参加しているグループはありません
        </Typography>
      ) : (
        <>
          {getGroupData.groups.map(({ id, name, users }) => {
            return (
              <Group
                key={id}
                id={id}
                name={name}
                users={users}
                handleClick={loginGroup}
              />
            );
          })}
        </>
      )}
    </Container>
  );
};

export default Landing;
