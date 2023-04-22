import React from "react";
import styled from "styled-components";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
      filter: blur(0.3px) brightness(0);
      position: absolute;
      content: "SOCIAL SEED";
      animation: animate 3s linear infinite;
      animation-delay: 2s;
      z-index: 1;
    }

    @keyframes animate {
      0% {
        filter: blur(0.5px) brightness(1);
      }
      3% {
        filter: blur(0.5px) brightness(0);
      }
      6% {
        filter: blur(1px) brightness(1);
      }
      8% {
        filter: blur(0.5px) brightness(0);
      }
      9% {
        filter: blur(1px) brightness(1);
      }
      10% {
        filter: blur(1px) brightness(0);
      }
      11% {
        filter: blur(0.5px) brightness(1);
      }
      20% {
        filter: blur(0.5px) brightness(1);
      }

      90% {
        filter: blur(0.5px) brightness(1);
      }
      100% {
        filter: blur(0.5px) brightness(1);
      }
    }
  }
`;


export default function SocialSeed() {
  return (
    <div>
      <Logo>
        <FontAwesomeIcon icon={faUsers} />
        <h1>SOCIAL SEED</h1>

      </Logo>
    </div>
  );
}
