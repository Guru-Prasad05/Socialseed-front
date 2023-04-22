import React from "react";
import styled from "styled-components";

const Button = styled.input`
  border: none;
  border-radius: 3px;
  margin-top: 12px;
  background-color: ${(props) => props.theme.accent};
  color: #ffffff;
  text-align: center;
  padding: 8px 0;
  font-weight: 600;
  width: 100%;
  opacity: ${(props) => (props.disabled ? "0.3" : "1")};
  cursor: pointer;
  transition: background-color .5s;
  &:hover{
    background-color:${props=>props.theme.hover}
  }
`;

export default Button;
