import * as React from "react";
import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import nookies from "nookies";
import { useQuery, useMutation } from "@apollo/client";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import Alert from "@mui/material/Alert";
import { styled } from "@mui/material";
import { addApolloState, initializeApollo } from "../lib/apollo/apollo-client";
import {
  getUserProps,
  getUserVarsProps,
  GET_USER,
} from "../lib/apollo/api/getUser";
import { getUser } from "../lib/apollo/server/getUser";
import {
  UPLOAD_PROFILE_IMAGE,
  uploadProfileImageProps,
  uploadProfileImageVarsProps,
} from "../lib/apollo/api/uploadProfileImage";

const ProfilePage: NextPage<ServerSideProps> = ({ cookies }) => {
  const [imageURL, setImageURL] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [uploading, setUploading] = React.useState(false);
  const [upload] = useMutation<
    uploadProfileImageProps,
    uploadProfileImageVarsProps
  >(UPLOAD_PROFILE_IMAGE);

  const onChange: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const files = e.currentTarget.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    const file = files[0];
    // todo: fileの拡張子をチェックする
    const uploadProfileImageVars: uploadProfileImageVarsProps = {
      data: file,
    };
    const { data } = await upload({ variables: uploadProfileImageVars });
    if (!data) {
      setUploading(false);
      setMessage("画像がアップロードできませんでした");
      return;
    }
    if (data.uploadProfileImage) {
      setUploading(false);
      setImageURL(data.uploadProfileImage.path);
    }
  };

  const getUserQueryVars = {
    userID: cookies["userID"],
  };
  const { loading, error, data, fetchMore, networkStatus } = useQuery<
    getUserProps,
    getUserVarsProps
  >(GET_USER, {
    variables: getUserQueryVars,
    // networkStatusが変わるとコンポーネントが再レンダリングされる
    notifyOnNetworkStatusChange: true,
  });

  if (loading || !data) {
    return <div>loading</div>;
  }

  return (
    <Wrapper component="main" maxWidth="xs">
      <SectionWrapper>
        <BrandIcon
          sx={{ bgcolor: "secondary.main" }}
          src="/images/icon-192x192.png"
        />
        <Typography component="h1" variant="h6">
          プロフィール写真設定
        </Typography>
      </SectionWrapper>
      {message && <Alert severity="error">{message}</Alert>}
      {uploading ? (
        <div>loading</div>
      ) : (
        <ProfileImage
          image={imageURL || data.user.imageURL}
          title="Profile Photo"
        >
          <Grid container alignItems="center">
            <UploadArea htmlFor="upload-image">
              <HiddenInput
                id="upload-image"
                type="file"
                name="upload-image"
                onChange={onChange}
              />

              <DummyButton role="button">
                <CameraIcon />
              </DummyButton>
            </UploadArea>
          </Grid>
        </ProfileImage>
      )}
      <Link href="/">
        <LinkText component="a" variant="button" color="primary">
          home
        </LinkText>
      </Link>
    </Wrapper>
  );
};

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (
  context
) => {
  const cookies = nookies.get(context);
  const apolloClient = initializeApollo(cookies["jwtToken"]);

  await getUser(apolloClient, {
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

const Wrapper = styled(Container)`
  text-align: center;
` as typeof Container;

const SectionWrapper = styled("section")`
  margin-top: 8;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const BrandIcon = styled(Avatar)`
  margin: 8px;
`;

const ProfileImage = styled(CardMedia)`
  width: 160px;
  height: 160px;
  margin: 16px auto 0;
  border-radius: 50%;
`;

const UploadArea = styled(InputLabel)`
  border-radius: 50%;
`;

const HiddenInput = styled(Input)`
  display: none;
`;

const DummyButton = styled(Avatar)`
  width: 160px;
  height: 160px;
  background-color: rgba(0, 0, 0, 0.5);
`;

const CameraIcon = styled(CameraAltIcon)`
  font-size: 80px;
`;

const LinkText = styled(Typography)`
  margin: 16px 0;
  display: inline-block;
` as typeof Typography;

export default ProfilePage;
