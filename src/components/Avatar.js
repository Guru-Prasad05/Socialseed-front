import React from "react";
import styled from "styled-components";
const SAvatar = styled.div`
  width: ${(props) => (props.lg ? "35px" : "25px")};
  height: ${(props) => (props.lg ? "35px" : "25px")};
  border-radius: 50%;
  background: lightgray;
  overflow: hidden;
  cursor: pointer;
  outline: 2px solid lightgray;
  outline-offset: 2px;
  &:hover {
    outline-color: ${(props) => props.theme.accent};
  }
`;
const Img = styled.img`
  max-width: 100%;
  object-fit: contain;
`;

export default function Avatar({ url = "", lg = false }) {
  return <SAvatar lg={lg}>{url !== "" ? <Img src={url} /> : null}</SAvatar>;
}
