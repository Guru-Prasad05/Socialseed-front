import React, { useState } from "react";
import ReactDOM from "react-dom";
import PageTitle from "../components/PageTitle";
import Button from "../components/Auth/Button";
import { useForm } from "react-hook-form";
import { gql, useMutation } from "@apollo/client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import useUser from "../hooks/useUser";
import { FEED_QUERY } from "./Home";
import { useHistory } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";

const UPLOAD_PHOTO_MUTATION = gql`
  mutation uploadPhoto($file: Upload!, $caption: String) {
    uploadPhoto(file: $file, caption: $caption) {
      id
      file
      caption
    }
  }
`;

const ModalBackdrop = styled.div`
  position: fixed;
  z-index: 1;
  width: 100vw;
  height: 100vh;
  background-color: rgb(0, 0, 0, 0.85);
  div {
  }
`;

const FormContainer = styled.div`
  background-color: rgb(219,219,219);
  z-index: 20;
  border-radius: 20px;
  max-width: 700px;
  height: 450px;
  margin: 0 auto;
  margin-top: 100px;
`;

const CreatePost = styled.div`
  background-color: ${(props) => props.theme.bgColor};
  color: ${(props) => props.theme.accent};
  text-align: center;
  border-bottom: 2px solid ${(props) => props.theme.borderColor};
  border-radius: 20px 20px 0 0;
  font-size: 20px;
  padding: 10px 5px;
`;
const PostButton = styled(Button).attrs({
  as: "button",
})`
  cursor: pointer;
  padding: 8px 5px;
  width: 60px;
  font-size: 14px;
  align-self: flex-end;
  margin-right: 20px;
`;
const PhotoContainer = styled.div`
  position: relative;
  background-color: black;
  grid-column: 1/2;
  height: 350px;
  border-radius: 0 0 10px 0;
  span {
    position: absolute;
    text-align: center;
    border-radius: 15px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 15px 20px;

    svg {
      font-size:80px;
      border: none;
      color: ${(props) => props.theme.accent};
    }
  }
`;
const Captioncontainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const FormElement = styled.form`
  margin-top: 5px;
  display: grid;
  grid-template-columns: 3fr 1fr;
  justify-content: center;
  grid-gap: 10px;
`;

const CloseMod = styled.span`
  font-size: 30px;
  position: absolute;
  color: ${(props) => props.theme.borderColor};
  top: 10px;
  right: 30px;
  cursor: pointer;
`;

const CapInput = styled.textarea`
  height: 150px;
  border: 1px solid ${(props) => props.theme.borderColor};
  margin-right: 8px;
  text-align: start;
  border-radius: 5px;
  padding: 15px;
  font-size: 16px;
  resize: none;
  &:focus,
  &:valid {
    background-color: aliceblue;
    border-color: ${(props) => props.theme.accent};
  }
`;
const PreviewImg = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 0 0 10px 0;
`;

const LoadContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function Post({ close }) {
  const [file, setFile] = useState();
  const { data: userData } = useUser();
  const history = useHistory();
  const notify = () => toast.error("Somthing Wrong. Please Try Again");

  const updatePost = (cache, result) => {
    const {
      data: {
        uploadPhoto: { id, file, caption },
      },
    } = result;

    if (!id) {
      return;
    }

    const newPhoto = {
      __typename: "Photo",
      id,
      user: {
        ...userData.me,
      },
      caption,
      comments: [],
      createAt: Date.now() + "",
      isMine: true,
      file,
      likes: 0,
      commentNumber: 0,
      isLiked: false,
    };
    const cachePhoto = cache.writeFragment({
      data: newPhoto,
      fragment: gql`
        fragment Anonymous on Photo {
          id
          user {
            username
            avatar
          }
          caption
          comments
          createAt
          isMine
          file
          likes
          commentNumber
          isLiked
        }
      `,
    });

    cache.modify({
      id: `User:${userData.me.username}`,
      fields: {
        photos(prev) {
          return [...prev, cachePhoto];
        },
      },
    });
    const seeFeedQuery = cache.readQuery({ query: FEED_QUERY });

    cache.writeQuery({
      query: FEED_QUERY,
      data: { seeFeed: [...seeFeedQuery.seeFeed, cachePhoto] },
    });
    history.push(`/`, { message: "ok" });
  };

  const [uploadPhoto, { loading, error: uploadError }] = useMutation(
    UPLOAD_PHOTO_MUTATION,
    {
      update: updatePost,
    }
  );

  const { register, handleSubmit } = useForm();
  const onSubmitPost = async (data) => {
    if (loading) {
      return;
    }

    await uploadPhoto({
      variables: {
        file: data.file[0],
        caption: data.caption,
      },
    });
  };
  return ReactDOM.createPortal(
    <>
      <ModalBackdrop>
        <CloseMod onClick={() => close()}>X</CloseMod>
        <PageTitle title={"Post"} />
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          pauseOnHover
          theme="colored"
        />

        <FormContainer>
          <CreatePost>Create Post</CreatePost>
          {loading ? (
            <LoadContainer>
              <RotatingLines
                strokeColor="grey"
                strokeWidth="5"
                animationDuration="0.75"
                width="30"
                visible={true}
              />
            </LoadContainer>
          ) : (
            <FormElement onSubmit={handleSubmit(onSubmitPost)}>
              <div>
                <PhotoContainer>
                  {file ? (
                    <PreviewImg src={file} width="100%" height="100%" />
                  ) : (
                    <span>
                      <FontAwesomeIcon icon={faImage} />
                    </span>
                  )}
                </PhotoContainer>
                <input
                  ref={register({ required: true })}
                  type="file"
                  accept="jpg/png"
                  name="file"
                  onChange={(e) =>
                    setFile(URL.createObjectURL(e.target.files[0]))
                  }
                />
              </div>
              <Captioncontainer>
                <CapInput
                  ref={register({ required: true })}
                  type="text"
                  name="caption"
                  placeholder="write your caption here...."
                />

                <PostButton
                  type="submit"
                  onClick={() => (uploadError ? notify() : "")}
                >
                  Post
                </PostButton>
              </Captioncontainer>
            </FormElement>
          )}
        </FormContainer>
      </ModalBackdrop>
    </>,
    document.getElementById("modalBackdrop")
  );
}
