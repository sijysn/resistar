import { gql } from "@apollo/client";

export const UPLOAD_PROFILE_IMAGE = gql`
  mutation UploadProfileImage($data: Upload!) {
    uploadProfileImage(input: { data: $data }) {
      path
    }
  }
`;

export type uploadProfileImageProps = {
  uploadProfileImage: {
    path: string;
  };
};

export type uploadProfileImageVarsProps = {
  data: File;
};
