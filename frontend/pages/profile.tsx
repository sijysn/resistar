import * as React from "react";
import type { NextPage } from "next";
import { useMutation } from "@apollo/client";
import {
  UPLOAD_PROFILE_IMAGE,
  uploadProfileImageProps,
  uploadProfileImageVarsProps,
} from "../lib/apollo/api/uploadProfileImage";

const ProfilePage: NextPage = () => {
  const [imageURL, setImageURL] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [upload] = useMutation<
    uploadProfileImageProps,
    uploadProfileImageVarsProps
  >(UPLOAD_PROFILE_IMAGE);

  const onChange: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const files = e.currentTarget.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    // todo: fileの拡張子をチェックする
    const uploadProfileImageVars: uploadProfileImageVarsProps = {
      data: file,
    };
    const { data } = await upload({ variables: uploadProfileImageVars });
    if (!data) {
      setMessage("画像がアップロードできませんでした");
      return;
    }
    if (data.uploadProfileImage) {
      setImageURL(data.uploadProfileImage.path);
    }
  };

  return (
    <>
      <input type="file" accept="image/*" required onChange={onChange} />
      <img src={imageURL || ""} width="150" />
    </>
  );
};

export default ProfilePage;
