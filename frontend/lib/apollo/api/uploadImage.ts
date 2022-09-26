import { gql } from "@apollo/client";

export const UPLOAD_IMAGE = gql`
  mutation($file: Upload!) {
    uploadImage(file: $file) {
      message
      success
    }
  }
`;

export type uploadImageProps = {
  uploadImage: {
    message: string;
    success: boolean;
  };
};

export type uploadImageVarsProps = {
  file: File;
};
