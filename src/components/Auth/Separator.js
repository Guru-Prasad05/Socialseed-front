import React from "react";
import styled from "styled-components";

const SSeparator = styled.div`
  margin: 20px 0 30px 0;
  text-transform: uppercase;
  display: flex;
  justify-content: center;
  width: 100%;
  align-items: center;
  div {
    width: 100%;
    height: 1px;
    background-color: ${(props) => props.theme.borderColor};
  }
  span {
    margin: 0 10px;
    font-weight: 600;
    font-size: 12px;
    color: #8e8e8e;
  }
`;

export default function Separator() {
  return (
    <SSeparator>
      <div> </div>
      <span>Or</span>
      <div> </div>
    </SSeparator>
  );
}
