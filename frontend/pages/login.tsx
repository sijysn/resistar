import * as React from "react";
import type { NextPage } from "next";
import Link from "next/link";
import { useMutation } from "@apollo/client";
import {
  LOGIN_USER,
  loginUserProps,
  loginUserVarsProps,
} from "../lib/apollo/api/loginUser";
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

const LoginPage: NextPage = () => {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [message, setMessage] = React.useState("");

  const [login, { loading, error }] = useMutation<
    loginUserProps,
    loginUserVarsProps
  >(LOGIN_USER);

  const loginUser = async () => {
    const loginUserQueryVars: loginUserVarsProps = {
      email,
      password,
    };
    const { data } = await login({
      variables: loginUserQueryVars,
    });
    if (!data) {
      setMessage("予期せぬエラーが起こりました");
      return;
    }
    const { message: loginMessage, success } = data.loginUser;
    if (success) {
      router.reload();
      return;
    }
    if (loginMessage) {
      setMessage(loginMessage);
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
        <Avatar
          sx={{ m: 1, bgcolor: "secondary.main" }}
          src="/images/icon-192x192.png"
        />
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
          {/* <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          /> */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={loginUser}
          >
            ログイン
          </Button>
          <Link href="/createnew">
            <a>Resistarを使うのは初めてですか? 登録</a>
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
