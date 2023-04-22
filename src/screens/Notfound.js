import React from "react";
import styled from "styled-components";
import Button from "../components/Auth/Button";
import { Link } from "react-router-dom";
import routes from "../routes";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;
const HeadingTxt = styled.div`
  font-size: 150px;
  font-weight: 600;
  color: ${(props) => props.theme.accent};
`;
const Gif = styled.div`
  margin-bottom: 10px;
  img{
    border-radius: 5px;
    border: 2px solid ${(props) => props.theme.borderColor};
    outline:2px solid ${(props) => props.theme.borderColor}; 
    outline-offset: 5px;
  }
`;
const Goto = styled(Button).attrs({
  as: "button",
})`
  width: 100px;
`;
const Msg = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap:5px;
`;
const Text = styled.p`
  &:first-child {
    font-size: 15px;
    font-weight: 600;
    color: ${(props) => props.theme.accent};
  }
  &:last-child{
    font-size: 12px;
    opacity: 60%;
  }
`;

export default function Notfound() {
  return (
    <Container>
      <HeadingTxt>404</HeadingTxt>
      <Gif>
        <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzM4ZmM3OGRkMzcyNmU5ZWQ4YjM1ZDkwNTU4MDI3ZjgxYmY1MGY4NiZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/pmLMx8PurJOvOnwM5g/giphy.gif" />
      </Gif>
      <Msg>
        <Text>Look like you're lost</Text>
        <Text>The page you are looking for not available</Text>
      </Msg>
      <Link to={routes.home}><Goto>Go to home</Goto></Link>
    </Container>
  );
}
