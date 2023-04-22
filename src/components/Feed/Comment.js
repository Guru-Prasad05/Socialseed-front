import React, { Fragment } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { FatText } from "../shared";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { RotatingLines } from "react-loader-spinner";

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($id: Int!) {
    deleteComment(id: $id) {
      ok
    }
  }
`;

const Button = styled.span`
  border: none;
  border-radius: 4px;
  margin-top: 8px;
  margin-left: 10px;
  background-color: tomato;
  cursor: pointer;
  color: #ffffff;
  text-align: center;
  padding: 4px 10px;
  font-weight: 600;
  font-size: 12px;
  width: 100%;
`;

const CommentsContainer = styled.div`
  margin-top: 20px;
  
`;
const CommentCaption = styled.span`
  margin-left: 10px;
  a {
    background-color: inherit;
    color: ${(props) => props.theme.accent};
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default function Comment({ photoId, author, payload, id, isMine}) {
  const updateDeleteComment = (cache, result) => {
    const {
      data: {
        deleteComment: { ok },
      },
    } = result;
    if (ok) {
      cache.evict({ id: `Comment:${id}` });
      cache.modify({
        id: `Photo:${photoId}`,
        fields: {
          commentNumber(prev) {
            return prev - 1;
          },
        },
      });
    }
  };

  const [deleteCommentMutation, { loading }] = useMutation(
    DELETE_COMMENT_MUTATION,
    {
      variables: {
        id,
      },
      update: updateDeleteComment,
    }
  );

  const onDeleteClick = () => {
    deleteCommentMutation();
  };

  return (
    <CommentsContainer>
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
          <Link to={`users/${author}`}>
            <FatText>{author}</FatText>
          </Link>

          <CommentCaption>
            {payload.split(" ").map((word) =>
              /#[\w]+/.test(word) ? (
                <Fragment key={uuidv4()}>
                  {" "}
                  <Link to={`hashtag/${word}`}>{word}</Link>{" "}
                </Fragment>
              ) : (
                <Fragment key={uuidv4()}>{word}</Fragment>
                )
                )}
          </CommentCaption>
          {isMine ? <Button onClick={onDeleteClick}>Delete</Button> : null}
        </>
      )}
    </CommentsContainer>
  );
}

Comment.propTypes = {
  photoId: PropTypes.number,
  isMine: PropTypes.bool,
  id: PropTypes.number,
  author: PropTypes.string.isRequired,
  payload: PropTypes.string.isRequired,
};
