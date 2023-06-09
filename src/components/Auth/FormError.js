import React from "react";
import styled from "styled-components";

const SFormError = styled.span`
  color: #e15151;
  font-weight: 600;
  font-size: 12px;
  margin: 5px 0 10px 0;
`;

export default function FormError({ message }) {
  return (message === "" ? null : <SFormError>{message}</SFormError>);
}
