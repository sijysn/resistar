import * as React from "react";
import type { NextPage } from "next";
import Link from "next/link";
import { useMutation } from "@apollo/client";
import {
  ADD_USER,
  addUserProps,
  addUserVarsProps,
} from "../lib/apollo/api/addUser";
import { useRouter } from "next/router";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

const CreateNewPage: NextPage = () => {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmationPassword, setConfirmationPassword] = React.useState("");
  const [message, setMessage] = React.useState("");

  const [addUser, { loading, error }] = useMutation<
    addUserProps,
    addUserVarsProps
  >(ADD_USER);

  const registerUser = async () => {
    setMessage("");
    if (password !== confirmationPassword) {
      setMessage("パスワードが一致しません");
      return;
    }
    const addUserQueryVars: addUserVarsProps = {
      email,
      password,
    };
    const { data } = await addUser({
      variables: addUserQueryVars,
    });
    if (!data) {
      setMessage("予期せぬエラーが起こりました");
      return;
    }
    const { message: addUserMessage, success } = data.addUser;
    if (success) {
      router.reload();
      return;
    }
    if (addUserMessage) {
      setMessage(addUserMessage);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Resistar
        </Typography>
        {message && (
          <Typography component="h1" variant="h5">
            {message}
          </Typography>
        )}
        <Box sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="メールアドレス"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="パスワード"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="パスワード(確認用)"
            type="password"
            value={confirmationPassword}
            onChange={(e) => setConfirmationPassword(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
          {/* <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          /> */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={registerUser}
          >
            登録
          </Button>
          <Link href="/login">
            <a>すでにResistarをお使いですか? ログイン</a>
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default CreateNewPage;
