import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/material";

type ModalProps = {
  isOpen: boolean;
  close: () => void;
  imageURL: string;
};

const ProfileImageModal: React.FC<ModalProps> = ({
  isOpen,
  close,
  imageURL,
}) => {
  return (
    <StyledBackdrop open={isOpen} onClick={close}>
      <StyledAvatar src={imageURL} onClick={(e) => e.stopPropagation()} />
    </StyledBackdrop>
  );
};

const StyledBackdrop = styled(Backdrop)`
  background-color: rgba(0, 0, 0, 0.7);
`;

const StyledAvatar = styled(Avatar)`
  max-width: 500px;
  max-height: 500px;
  width: 80vw;
  height: 80vw;
`;

export default ProfileImageModal;
