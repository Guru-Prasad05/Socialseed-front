import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { FatText } from "../shared";

const CommentsContainer = styled.div`
  margin-top: 20px;
`;
const CommentCaption = styled.span`
  margin-left: 10px;
`;

export default function Comment({ author, payload }) {
  return (
    <CommentsContainer>
      <FatText>{author}</FatText>
      <CommentCaption>{payload}</CommentCaption>
    </CommentsContainer>
  );
}

Comment.propTypes={
    author:PropTypes.string.isRequired,
    payload:PropTypes.string.isRequired
}