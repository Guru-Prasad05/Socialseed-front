import React, { useEffect } from "react";
import {
  gql,
  useApolloClient,
  useMutation,
  useQuery,
  useReactiveVar,
} from "@apollo/client";
import { isLoggedInVar } from "../apollo";
import FormError from "../components/Auth/FormError";
import Input from "../components/Auth/Input";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import Button from "../components/Auth/Button";
import { useHistory } from "react-router-dom";
import PageTitle from "../components/PageTitle"

const EDIT_PROFILE_MUTATION = gql`
  mutation editProfile(
    $firstName: String
    $lastName: String
    $username: String
    $email: String
    $password: String
    $bio: String
    $avatar: Upload
  ) {
    editProfile(
      firstName: $firstName
      lastName: $lastName
      username: $username
      email: $email
      password: $password
      bio: $bio
      avatar: $avatar
    ) {
      ok
      avatar
      error
    }
  }
`;

const ME_QUERY = gql`
  query me {
    me {
      username
      avatar
      firstName
      lastName
      email
      bio
    }
  }
`;

const Avatar = styled.img`
  margin-left: 50px;
  height: 70px;
  width: 70px;
  border-radius: 50%;
  margin-right: 10px;
  background-color: lightgray;
  outline: 2px solid lightgray;
  outline-offset: 5px;
`;

const Name = styled.div`
  font-size: 30px;
  font-weight: 600;
  color: grey;
  letter-spacing: 5px;
  text-decoration: underline;
  text-underline-offset: 8px;
  text-decoration-color: ${(props) => props.theme.borderColor};
  text-transform: uppercase;
`;

const Htop = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
`;

const EditContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 28rem;
`;

const EditInput = styled(Input)`
  align-self: center;
  justify-self: center;
  margin: 15px 0;
  width: 300px;
  display: block;
`;
const Label = styled.label`
  font-size: 15px;
  font-weight: 600;
  color: ${(props) => props.theme.accent};
`;

const TextBox = styled.textarea`
  width: 300px;
  height: 100px;
  resize: none;
`;

const SubBtn = styled(Button).attrs({
  as: "button",
})`
  width: 100px;
  margin-left: 50%;
  margin-bottom: 30px;
  cursor: pointer;
  padding: 10px 20px;
`;

export default function Edit() {
    const history=useHistory()
  const hasToken = useReactiveVar(isLoggedInVar);
  const { data } = useQuery(ME_QUERY, {
    skip: !hasToken,
  });

  const preLoadedValue = {
    firstName: data?.me?.firstName,
    lastName: data?.me?.lastName,
    email: data?.me?.email,
    username: data?.me?.username,
    bio: data?.me?.bio,
  };

  const { register, handleSubmit, errors, formState, getValues } = useForm({
    mode: "onChange",
    defaultValues: preLoadedValue,
  });
  const { firstName, lastName, username, email, bio } = getValues();

  const onCompleted = (cache, result) => {
    const {
      data: {
        editProfile: { ok, avatar },
      },
    } = result;
    
    if (!ok) {
      return;
    }

    cache.modify({
      id: `User:${username}`,
      fields: {
        firstName(){
            return firstName
        },
        lastName(){
            return lastName
        },
        username(){
            return username
        },
        email(){
            return email
        },
        bio(){
            return bio
        },
        avatar(){
            return avatar? avatar:data?.me?.avatar
        },
        isMe(){
          return true
        },
        isFollowing(){
          return false
        }
      },
    });
    history.push(`/users/${username}`,{message:"ok"})
  };
  const [editProfile, { loading}] = useMutation(
    EDIT_PROFILE_MUTATION,
    {
      update: onCompleted,
    }
  );

  useEffect(() => {
    if (data?.me === null) {
      logUserOut();
    }
  }, [data]);

  const onSubmitValid = (data) => {
    
    editProfile({
      variables: {
        firstName: data?.firstName,
        lastName: data?.lastName,
        username: data?.username,
        email: data?.email,
        bio: data?.bio,
        avatar: data?.avatar[0],
      },
    });
  };

  return (
    <>
      <Htop>
        <Avatar src={data?.me?.avatar} type="file" />
        <Name>{`${data?.me?.username}'s profile`}</Name>
      </Htop>
      <PageTitle title="Edit"/>
      <form onSubmit={handleSubmit(onSubmitValid)}>
        <EditContainer>
          <Row>
            <Label htmlFor="firstName">FIRSTNAME :</Label>
            <EditInput
              ref={register({
                required: "Firstname is required",
              })}
              name="firstName"
              type="text"
              placeholder="Firstname"
            />
          </Row>
          <FormError message={errors?.firstName?.message} />
          <Row>
            <Label htmlFor="lastName">LASTNAME :</Label>
            <EditInput
              ref={register({})}
              name="lastName"
              type="text"
              placeholder="Lastname"
            />
          </Row>
          <FormError message={errors?.lastName?.message} />
          <Row>
            <Label htmlFor="email">EMAIL :</Label>
            <EditInput
              ref={register({
                required: "Email is required",
              })}
              name="email"
              type="text"
              placeholder="Email"
            />
          </Row>
          <FormError message={errors?.email?.message} />
          <Row>
            <Label htmlFor="username">USERNAME :</Label>
            <EditInput
              ref={register({
                required: "Username is required",
                minLength: {
                  value: 4,
                  message: "Username should be longer than 4 chars.",
                },
              })}
              name="username"
              type="text"
              placeholder="Username"
            />
          </Row>
          <Row>
            <Label htmlFor="avatar">Avatar :</Label>
            <EditInput
              ref={register({ required: false })}
              name="avatar"
              type="file"
              accept="jpg/png"
            />
          </Row>

          <FormError message={errors?.username?.message} />
          <Row>
            <Label htmlFor="password">NEW PASSWORD :</Label>
            <EditInput
              ref={register({
                required: false,
              })}
              name="password"
              type="password"
              placeholder="New password"
            />
          </Row>
          <Row>
            <Label htmlFor="Bio">BIO :</Label>
            <TextBox
              ref={register({
                required: false,
              })}
              name="bio"
              type="text"
              placeholder="Bio"
            />
          </Row>
          <FormError message={errors?.password?.message} />
        </EditContainer>
       <SubBtn
          type="submit"
          link={`/users/${username}`}
          //   value={loading ? "Loading..." : "Submit"}
          disabled={!formState.isValid} //||loading
        >
          SUBMIT
        </SubBtn>
    
        <FormError message={errors?.result?.message} />
      </form>
    </>
  );
}
