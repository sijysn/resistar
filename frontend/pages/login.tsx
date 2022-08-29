import * as React from "react";
import type { GetServerSideProps, NextPage } from "next";
import { useMutation } from "@apollo/client";
import nookies, { parseCookies } from "nookies";
import {
  LOGIN_USER,
  loginUserProps,
  loginUserVarsProps,
} from "../lib/apollo/api/loginUser";
import { useRouter } from "next/router";

const LoginPage: NextPage = () => {
  const router = useRouter();
  const [email, setEmail] = React.useState("seiji@example.com");
  const [password, setPassword] = React.useState("password");
  const [groupID, setGroupID] = React.useState("1");

  const [login, { loading, error }] = useMutation<
    loginUserProps,
    loginUserVarsProps
  >(LOGIN_USER);

  const loginUser = async () => {
    const loginUserQueryVars: loginUserVarsProps = {
      email,
      password,
      groupID,
    };
    await login({
      variables: loginUserQueryVars,
    });
  };

  const cookies = parseCookies();
  React.useEffect(() => {
    if (cookies["jwt-token"]) {
      router.push("/");
    }
  });

  return <div onClick={loginUser}>Enter</div>;
};

export default LoginPage;
