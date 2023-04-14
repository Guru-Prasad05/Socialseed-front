import React from "react";
import styled from "styled-components";
import { faCompass } from "@fortawesome/free-regular-svg-icons";
import { faHome, faPowerOff} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isLoggedInVar, logUserOut } from "../apollo";
import { useReactiveVar } from "@apollo/client";
import useUser from "../hooks/useUser";
import Avatar from "./Avatar";
import { Link, useHistory } from "react-router-dom";
import routes from "../routes";

const SHeader = styled.header`
  width: 100%;
  border-bottom: 1px solid ${(props) => props.theme.borderColor};
  background-color: ${(props) => props.theme.bgColor};
  padding: 18px 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
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

const LogoutIcon = styled.span`
  margin-left:20px;
  svg{
    color:${props=>props.theme.borderColor};
    font-size: 20px;
    font-weight: 600;
    cursor: pointer;

    &:hover{
      color:${props=>props.theme.accent};
    }
  }
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
  const history=useHistory()
  const { data } = useUser();

  const logout=()=>{
    history.push("/")
   return logUserOut()
  }
  
  return (
    <SHeader>
      <Wrapper>
        <Column>LOGO</Column>

        {isLoggedIn ? (
          <IconContainer>
            <Icon>
              <Link to={routes.home}>
                <FontAwesomeIcon icon={faHome} size="lg" />
              </Link>
            </Icon>
            <Icon>
              <Link to={"/seephotos"}>
              <FontAwesomeIcon icon={faCompass} size="lg" />
              </Link>
            </Icon>
            <Icon>
              <Link to={`/users/${data?.me?.username}`}>
                <Avatar url={data?.me?.avatar} />
              </Link>
            </Icon>
          </IconContainer>
        ) : (
          <Link to={routes.home}>
            <Button>Login</Button>
          </Link>
        )}
      </Wrapper>
      {isLoggedIn ?<LogoutIcon title="Logout" onClick={logout}>
        <FontAwesomeIcon icon={faPowerOff} />
      </LogoutIcon>:null}
    </SHeader>
  );
}
