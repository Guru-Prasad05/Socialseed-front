import React from "react";
import AuthLayout from "../components/Auth/AuthLayout.js";
import routes from "../routes.js";
import Button from "../components/Auth/Button.js";
import Input from "../components/Auth/Input.js";
import FormBox from "../components/Auth/FormBox.js";
import BottomBox from "../components/Auth/BottomBox.js";
import styled from "styled-components";
import { FatLink } from "../components/shared.js";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Subtitle = styled(FatLink)`
  font-size: 1rem;
  text-align: center;
  margin-top: 10px;
`;

export default function Signup() {
  
  return (
    <AuthLayout>
      <Helmet>
        <title>Signup | Social-Seed</title>
      </Helmet>
      <FormBox>
        <HeaderContainer>
          LOGO
          <Subtitle>
            Sign up to see photos and video from your friends.
          </Subtitle>
        </HeaderContainer>
        <form>
          <Input type="text" placeholder="Firstname" />
          <Input type="text" placeholder="Lastname" />
          <Input type="text" placeholder="Email" />
          <Input type="text" placeholder="Username" />
          <Input type="password" placeholder="Password" />
          <Button type="submit" value="Sign up" />
        </form>
      </FormBox>
      <BottomBox cta="Have an account?" link={routes.home} linkText="Login" />
    </AuthLayout>
  );
}
