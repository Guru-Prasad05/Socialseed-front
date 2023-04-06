import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-regular-svg-icons";
import { useReactiveVar } from "@apollo/client";
import { darkModeVar, disableDarkMode, enableDarkMode } from "../../apollo";

const Container = styled.div`
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
  flex-direction: coulmn;
  position:relative;
`;

const Footer = styled.footer`
  margin-top: 500px;
  position:absolute;
`;

const DarkModeBtn = styled.span`
  cursor: pointer;
`;

const Wrapper = styled.div`
  max-width: 350px;
  width: 100%;
`;

export default function AuthLayout({children}) {
  const darkMode = useReactiveVar(darkModeVar);
  return (
    <Container>
      <Wrapper>{children}</Wrapper>
      <Footer>
        <DarkModeBtn onClick={darkMode?disableDarkMode:enableDarkMode}>
          <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
        </DarkModeBtn>
      </Footer>
    </Container>
  );
}
