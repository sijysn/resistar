import * as React from "react";
import { ApolloError } from "@apollo/client";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material";
import MemberItem from "../../common/MemberItem";
import ProfileImageModal from "../../common/ProfileImageModal";
import { getUsersProps } from "../../../lib/apollo/api/getUsers";
import { DEFAULT_PROFILE_IMAGE_URL } from "../../../lib/constants";

type Props = {
  loading: boolean;
  error?: ApolloError;
  data?: getUsersProps;
};

const Members: React.FC<Props> = ({ loading, error, data }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const [modalImageURL, setModalImageURL] = React.useState("");
  const changeModalImageURL = (url: string) => {
    setModalImageURL(url);
    openModal();
  };

  if (error) return <Message>{error.message}</Message>;
  if (loading || !data) return <Message>Loading</Message>;
  if (data.users.length === 0) return <Message>メンバーがいません。</Message>;
  return (
    <>
      <MembersList>
        <MembersCountWrapper>
          <MembersCount variant="body2" color="text.secondary">
            メンバー({data.users.length})
          </MembersCount>
          <Divider />
        </MembersCountWrapper>
        {data.users.map(({ id, name, email, imageURL }) => {
          return (
            <MemberItem
              key={id}
              name={name}
              email={email}
              imageURL={imageURL || DEFAULT_PROFILE_IMAGE_URL}
              handleImageURL={changeModalImageURL}
            />
          );
        })}
      </MembersList>
      <ProfileImageModal
        isOpen={isModalOpen}
        close={closeModal}
        imageURL={modalImageURL}
      />
    </>
  );
};

const MembersList = styled(List)(
  ({ theme }) => `
  width: 100%;
  max-width: 360px;
  background-color: ${theme.palette.background.paper};
  margin: 0 auto;
`
) as typeof List;

const MembersCountWrapper = styled("div")`
  padding: 16px;
`;

const MembersCount = styled(Typography)`
  padding: 8px 0;
`;

const Message = styled("p")`
  text-align: center;
`;

export default Members;
