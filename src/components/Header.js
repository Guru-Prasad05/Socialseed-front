import React from "react";
import styled from "styled-components";
import { faCompass, faUser } from "@fortawesome/free-regular-svg-icons";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isLoggedInVar } from "../apollo";
import { useReactiveVar } from "@apollo/client";
import useUser from "../hooks/useUser";
import Avatar from "./Avatar";
import { Link } from "react-router-dom";
import routes from "../routes";

const SHeader = styled.header`
  width: 100%;
  border-bottom: 1px solid ${(props) => props.theme.borderColor};
  background-color: ${(props) => props.theme.bgColor};
  padding: 18px 0px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Wrapper = styled.div`
  max-width: 930px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Column = styled.div``;

const Icon = styled.span`
  margin-left: 15px;
`;
const IconContainer = styled.div`
  display: flex;
  align-items: center;
`;
const Button = styled.span`
  background-color: ${(props) => props.theme.accent};
  border-radius: 4px;
  padding: 5px 15px;
  color: #ffffff;
  font-weight: 600;
`;

export default function Header() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const { data } = useUser();
  return (
    <SHeader>
      <Wrapper>
        <Column>LOGO</Column>

        {isLoggedIn ? (
          <IconContainer>
            <Icon>
              <FontAwesomeIcon icon={faHome} size="lg" />
            </Icon>
            <Icon>
              <FontAwesomeIcon icon={faCompass} size="lg" />
            </Icon>
            <Icon>
              {data?.me?.avatar ? (
                <Avatar url={data?.me?.avatar} />
              ) : (
                <FontAwesomeIcon icon={faUser} size="lg" />
              )}
            </Icon>
          </IconContainer>
        ) : (
          <Link href={routes.home}>
            <Button>Login</Button>
          </Link>
        )}
      </Wrapper>
    </SHeader>
  );
}
