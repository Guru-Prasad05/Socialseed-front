import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
  flex-direction: coulmn;
`;

const Wrapper = styled.div`
  max-width: 350px;
  width: 100%;
`;

export default function AuthLayout(props) {
  return (
    <Container>
      <Wrapper>{props.children}</Wrapper>
    </Container>
  );
}
