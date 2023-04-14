import React from "react";
import AuthLayout from "../components/Auth/AuthLayout.js";
import routes from "../routes.js";
import Button from "../components/Auth/Button.js";
import Input from "../components/Auth/Input.js";
import FormBox from "../components/Auth/FormBox.js";
import BottomBox from "../components/Auth/BottomBox.js";
import styled from "styled-components";
import FormError from "../components/Auth/FormError.js";
import { useForm } from "react-hook-form";
import { gql, useMutation } from "@apollo/client";
import { FatLink } from "../components/shared.js";
import { useHistory } from "react-router-dom";
import PageTitle from "../components/PageTitle.js";

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const WrapperTitle = styled(FatLink)`
  font-size: 1rem;
  text-align: center;
  margin-top: 10px;
`;

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccount(
    $firstName: String!
    $lastName: String!
    $username: String!
    $email: String!
    $password: String!
  ) {
    createAccount(
      firstName: $firstName
      lastName: $lastName
      username: $username
      email: $email
      password: $password
    ) {
      ok
      error
    }
  }
`;

export default function Signup() {
  const history = useHistory();

  const onCompleted = (data) => {
    const { username, password } = getValues();

    const {
      createAccount: { ok },
    } = data;
    if (!ok) {
      return;
    }
    history.push(routes.home, {
      message: "ok",
      username,
      password,
    });
  };
  const [createAccount, { loading, error, data }] = useMutation(
    CREATE_ACCOUNT_MUTATION,
    { onCompleted }
  );
  const { register, handleSubmit, errors, formState, getValues } = useForm({
    mode: "onChange",
  });
  const onSubmitValid = (data) => {
    if (loading) {
      return;
    }

    createAccount({
      variables: {
        ...data,
      },
    });
  };
  return (
    <AuthLayout>
      <PageTitle title={"Signup"} />
      <FormBox>
        <HeaderContainer>
          LOGO
          <WrapperTitle>
            Sign up to see photos and video from your friends.
          </WrapperTitle>
        </HeaderContainer>
        <form onSubmit={handleSubmit(onSubmitValid)}>
          <Input
            ref={register({
              required: "Firstname is required",
            })}
            name="firstName"
            type="text"
            placeholder="Firstname"
          />
          <FormError message={errors?.firstName?.message} />
          <Input
            ref={register({})}
            name="lastName"
            type="text"
            placeholder="Lastname"
          />
          <FormError message={errors?.lastName?.message} />
          <Input
            ref={register({
              required: "Email is required",
            })}
            name="email"
            type="text"
            placeholder="Email"
          />
          <FormError message={errors?.email?.message} />
          <Input
            ref={register({
              required: "Username is required",
              minLength: {
                value: 5,
                message: "Username should be longer than 5 chars.",
              },
            })}
            name="username"
            type="text"
            placeholder="Username"
          />
          <FormError message={errors?.username?.message} />
          <Input
            ref={register({
              required: "Password is required",
            })}
            name="password"
            type="password"
            placeholder="Password"
          />
          <FormError message={errors?.password?.message} />
          <Button
            type="submit"
            value={loading ? "Loading..." : "Sign up"}
            disabled={!formState.isValid || loading}
          />
          <FormError message={errors?.result?.message} />
        </form>
      </FormBox>
      <BottomBox cta="Have an account?" link={routes.home} linkText="Login" />
    </AuthLayout>
  );
}
