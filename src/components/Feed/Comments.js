import React from "react";
import PropTypes from "prop-types";

import styled from "styled-components";
import Comment from "./Comment";
import { useForm } from "react-hook-form";
import { gql, useMutation } from "@apollo/client";
import useUser from "../../hooks/useUser";
import { RotatingLines } from "react-loader-spinner";

const CREATE_COMMENT_MUTATION = gql`
  mutation createComment($photoId: Int!, $payload: String!) {
    createComment(photoId: $photoId, payload: $payload) {
      ok
      id
      error
      createAt
    }
  }
`;

const PostCommentContainer = styled.div`
  margin-top: 10px;
  padding-top: 15px;
  padding-bottom: 10px;
  border-top: 1px solid ${(props) => props.theme.borderColor};
`;

const PostCommentInput = styled.input`
  width: 100%;
  &::placeholder {
    font-size: 12px;
  }
`;

const CommentsContainer = styled.div`
  margin-top: 20px;
`;

const CommentCount = styled.span`
  opacity: 0.7;
  margin: 10px 0;
  display: block;
  font-weight: 600;
  font-size: 10px;
`;

function Comments({ author, caption, commentNumber, comments, photoId }) {
  const { data: userData } = useUser();

  const { register, handleSubmit, setValue, getValues } = useForm();

  const createCommentUpdate = (cache, result) => {
    const { payload } = getValues();
    setValue("payload", "");
    const {
      data: {
        createComment: { ok, id },
      },
    } = result;

    if (ok && userData?.me) {
      const newComment = {
        __typename: "Comment",
        createAt: Date.now() + "",
        id,
        isMine: true,
        payload,
        user: {
          ...userData.me,
        },
      };
      const newCacheComment = cache.writeFragment({
        data: newComment,
        fragment: gql`
          fragment BSName on Comment {
            id
            createAt
            isMine
            payload
            user {
              username
              avatar
            }
          }
        `,
      });

      cache.modify({
        id: `Photo:${photoId}`,
        fields: {
          comments(prev) {
            return [...prev, newCacheComment];
          },
          commentNumber(prev) {
            return prev + 1;
          },
        },
      });
    }
  };

  const [createCommentMutation, { data: commentResponse, loading }] =
    useMutation(CREATE_COMMENT_MUTATION, {
      update: createCommentUpdate,
    });

  const onValid = (data) => {
    const { payload } = data;
    if (loading) {
      return;
    }
    createCommentMutation({
      variables: {
        photoId,
        payload,
      },
    });
  };


  return (
    <CommentsContainer>
      <Comment author={author} payload={caption} />
      {loading ? (
        <RotatingLines
          strokeColor="grey"
          strokeWidth="5"
          animationDuration="0.75"
          width="30"
          visible={true}
        />
      ) : (
        <>
          <CommentCount>
            {commentNumber === 1 ? "1 comment" : `${commentNumber} comments`}
          </CommentCount>

          {comments?.map((comment) => (
            <Comment
              key={comment.id}
              id={comment.id}
              photoId={photoId}
              author={comment.user.username}
              payload={comment.payload}
              isMine={comment.isMine}
            />
          ))}
        </>
      )}
      <PostCommentContainer>
        <form onSubmit={handleSubmit(onValid)}>
          <PostCommentInput
            name="payload"
            ref={register({ required: true })}
            type="text"
            placeholder="Write a comment...."
          />
        </form>
      </PostCommentContainer>
    </CommentsContainer>
  );
}

Comments.propTypes = {
  photoId: PropTypes.number.isRequired,
  author: PropTypes.string.isRequired,
  caption: PropTypes.string,
  commentNumber: PropTypes.number.isRequired,
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      user: PropTypes.shape({
        avatar: PropTypes.string,
        username: PropTypes.string.isRequired,
      }),
      payload: PropTypes.string.isRequired,
      isMine: PropTypes.bool.isRequired,
      createAt: PropTypes.string.isRequired,
    })
  ),
};

export default Comments;
