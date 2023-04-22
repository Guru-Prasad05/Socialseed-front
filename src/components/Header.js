import React from "react";
import styled from "styled-components";
import { faCompass, faThumbsUp } from "@fortawesome/free-regular-svg-icons";
import { faHome, faPowerOff, faUsers } from "@fortawesome/free-solid-svg-icons";
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
  svg{
    &:hover{
      color: ${props=>props.theme.accent};
    }
  }
`;

const LogoutIcon = styled.span`
  margin-left: 20px;
  svg {
    color: ${(props) => props.theme.borderColor};
    font-size: 20px;
    font-weight: 600;
    cursor: pointer;

    &:hover {
      color:#E15554;
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

const Logo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  position: relative;
  svg {
    color: ${(props) => props.theme.accent};
    font-size: 15px;
    
  }

  h1 {
    font-size: 15px;
    font-weight: 500;
    letter-spacing: 5px;
    border-left: 3px solid ${(props) => props.theme.borderColor};
    padding: 5px 10px;
    color: ${(props) => props.theme.accent};
  
    

    &::before {
      text-shadow: 0 0 5px ${(props) => props.theme.accent};
      filter: blur(.3px) brightness(0);
      position: absolute;
      content: "SOCIAL SEED";
      animation: animate 3s linear infinite;
      animation-delay: 2s;
      z-index: 1;
    }

    @keyframes animate {
      0%{
        filter: blur(.5px) brightness(1);
      }
      3%{
        filter: blur(.5px) brightness(0);
      }
      6%{
        filter: blur(1px) brightness(1);
      }
      8%{
        filter: blur(.5px) brightness(0);
      }
      9%{
        filter: blur(1px) brightness(1);
      }
      10%{
        filter: blur(1px) brightness(0);
      }
      11%{
        filter: blur(0.5px) brightness(1);
      }
      20%{
        filter: blur(.5px) brightness(1);
      }
      
      90%{
        filter: blur(.5px) brightness(1);
      }
      100%{
        filter: blur(0.5px) brightness(1);
      }
    }
  }
`;

const Star = styled.span`
  svg {
    font-size: 15px;
    position: absolute;
    bottom: 60%;
    left: 84%;
    rotate: -25deg;
    z-index: 0;
    color: #f9dcdc;
    animation: like 3s linear infinite;
    animation-delay: 2s;
      filter: blur(.5px) brightness(1);

    @keyframes like {
      0%{
        color: #f0a8a8;
        rotate: 0deg;
      }
      10%{
        color: #e77373;
        rotate: 10deg;
      }
      20%{
        color: #e15151;
        rotate: -10deg;
      }
      30%{
        color: #dc2e2e;
        rotate: -20deg;
      }
      50%{
        color: #f0a8a8;
      }
      70%{
       color: #e77373;
      }
      90%{
        color: #e15151;
      }
      100%{
        color: #dc2e2e;
      }
    }
  }
`;

export default function Header() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const history = useHistory();
  const { data } = useUser();

  const logout = () => {
    history.push("/");
    return logUserOut();
  };

  return (
    <SHeader>
      <Wrapper>
        <Column>
          <Logo>
            <FontAwesomeIcon icon={faUsers} />
            <h1>SOCIAL SEED</h1>
            <Star>
              <FontAwesomeIcon icon={faThumbsUp} />
            </Star>
          </Logo>
        </Column>

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
      {isLoggedIn ? (
        <LogoutIcon title="Logout" onClick={logout}>
          <FontAwesomeIcon icon={faPowerOff} />
        </LogoutIcon>
      ) : null}
    </SHeader>
  );
}
