import React, { useEffect } from "react";
import { faFacebookSquare } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import AuthLayout from "../components/Auth/AuthLayout.js";
import routes from "../routes.js";
import Button from "../components/Auth/Button.js";
import Separator from "../components/Auth/Separator.js";
import Input from "../components/Auth/Input.js";
import FormBox from "../components/Auth/FormBox.js";
import BottomBox from "../components/Auth/BottomBox.js";
import { useForm } from "react-hook-form";
import FormError from "../components/Auth/FormError.js";
import { gql, useMutation } from "@apollo/client";
import { logUserIn } from "../apollo.js";
import { useLocation } from "react-router-dom";
import PageTitle from "../components/PageTitle.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SocialSeed from "../components/Auth/SocialSeedLogo.js";

const FacebookLogin = styled.div`
  color: #385285;
  span {
    margin-left: 10px;
    font-weight: 600;
  }
`;
// const Notification = styled.div`
//   color: #ffffff;
//   background-color: #2ecc71;
//   text-align: center;
//   font-size: 16px;
//   padding: 5px 10px;
//   border-radius: 5px;
//   box-shadow: 0 0 10px 0 rgb(0, 0, 0, 0.35);
//   margin-top: 10px;
// `;

const LOGIN_MUTATION = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      ok
      error
      token
    }
  }
`;

export default function Login() {
  const location = useLocation();
  const notify = () =>
    toast.success("Account created successfully please Login!!!");

  const {
    register,
    handleSubmit,
    errors,
    formState,
    getValues,
    setError,
    clearErrors,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      username: location?.state?.username || "",
      password: location?.state?.password || "",
    },
  });
  const onCompleted = (data) => {
    const {
      login: { ok, error, token },
    } = data;
    if (!ok) {
      return setError("result", {
        message: error,
      });
    }
    if (token) {
      logUserIn(token);
    }
  };
  const [login, { loading }] = useMutation(LOGIN_MUTATION, { onCompleted });
  const onSubmitValid = (data) => {
    if (loading) {
      return;
    }

    const { username, password } = getValues();
    login({
      variables: { username, password },
    });
  };
  const clearLoginError = () => {
    clearErrors("result");
  };
  useEffect(()=>{
    if(location?.state?.message==="ok"){
      notify()
    }
  },[])
  return (
    <AuthLayout>
      <PageTitle title={"Login"} />
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <FormBox>
        <SocialSeed/>
        <form onSubmit={handleSubmit(onSubmitValid)}>
          <Input
            ref={register({
              required: "Username is required",
              minLength: {
                value: 5,
                message: "Username should be longer than 5 chars.",
              },
            })}
            onChange={clearLoginError}
            name="username"
            type="text"
            placeholder="Username"
            hasError={Boolean(errors?.username?.message)}
          />
          <FormError message={errors?.username?.message} />
          <Input
            ref={register({
              required: "Password is required",
            })}
            onChange={clearLoginError}
            name="password"
            type="password"
            placeholder="Password"
            hasError={Boolean(errors?.password?.message)}
          />
          <FormError message={errors?.password?.message} />
          <Button
            type="submit"
            value={loading ? "Loading..." : "Login"}
            disabled={!formState.isValid || loading}
          />
          <FormError message={errors?.result?.message} />
        </form>
        <Separator />
        <FacebookLogin>
          <FontAwesomeIcon icon={faFacebookSquare} />
          <span>Login with facebook</span>
        </FacebookLogin>
      </FormBox>
      <BottomBox
        cta="Don't have an account?"
        link={routes.signUp}
        linkText="Sign Up"
      />
    </AuthLayout>
  );
}
