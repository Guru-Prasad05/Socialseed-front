import React from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { FatText } from "../components/shared";
import Button from "../components/Auth/Button";
import { useHistory } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";

export const SEE_FOLLOWERS_QUERY = gql`
  query seeFollowers($username: String!) {
    seeFollowers(username: $username) {
      ok
      followers {
        user {
          id
          username
          avatar
          firstName
          lastName
        }
      }
    }
  }
`;

const REMOVE_FOLLOWER_MUTATION = gql`
  mutation removeFollower($id: Int!) {
    removeFollower(id: $id) {
      ok
      error
    }
  }
`;

const ModalBackdrop = styled.div`
  position: fixed;
  z-index: 1;
  width: 100vw;
  height: 100vh;
  background-color: rgb(0, 0, 0, 0.85);
  div {
  }
`;

const FollowContainer = styled.div`
  background-color: ${props=>props.theme.bgColor};
  z-index: 20;
  border-radius: 15px;
  max-width: 350px;
  height: 400px;
  margin: 0 auto;
  margin-top: 100px;
`;

const Heading = styled.div`
  background-color: ${props=>props.theme.bgColor};
  border-radius: 20px 20px 0 0;
  font-size: 18px;
  padding: 10px 15px;
  font-weight: 600;
  margin: 0 auto;
`;

const Close = styled.span`
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
  margin-right: 10px;
`;

const Avatar = styled.div`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: lightgray;
  overflow: hidden;
  cursor: pointer;
  outline: 3px solid lightgray;
  outline-offset: 3px;
  img {
    max-width: 100%;
    object-fit: contain;
  }
`;

const Box = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid ${(props) => props.theme.borderColor};
`;

const RemoveButton = styled(Button).attrs({
  as: "div",
})`
  margin-top: 0;
  width: 90px;
  font-size: 14px;
  text-align: center;
  cursor: pointer;
  padding: 8px 10px;
  margin-left: 25px;
`;
const FollowerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 20px;
`;
const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
`;

const Txt = styled(FatText)`
  font-size: 15px;
  width: 100px;
`;
const FullName = styled.span`
  font-size: 12px;
  color: rgb(115, 115, 115);
`;
const ScrollBar = styled.div`
  display: block;
  height: 350px;
  border-radius: 12px;
  overflow-y: scroll;
  position: relative;
  flex-grow: 1;
  flex-shrink: 1;
  position: relative;
`;
const LoadContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function ShowFollowers({ close, name, userId, isMe }) {
  const history = useHistory();
  const { data, loading: following } = useQuery(SEE_FOLLOWERS_QUERY, {
    variables: {
      username: name,
    },
  });

  const removeFollowerUpdate = (cache, result) => {
    const {
      data: {
        removeFollower: { ok },
        id,
      },
    } = result;

    if (!ok) {
      return;
    }
    cache.modify({
      id: `Follower:${id}`,
      fields: {
        isFollowing() {
          return false;
        },
        totalFollowing(prev) {
          return prev - 1;
        },
      },
    });
    cache.evict({
      followerid: `Follower:${id}`,
      fields: {
        followerId: userId,
      },
    });

    cache.modify({
      id: `User:${name}`,
      fields: {
        totalFollower(prev) {
          return prev - 1;
        },
      },
    });
  };

  const [removeFollower, { loading: remove }] = useMutation(
    REMOVE_FOLLOWER_MUTATION,
    {
      update: removeFollowerUpdate,
    }
  );

  const discardFollower = (value) => {
    removeFollower({
      variables: {
        id: value,
      },
    });
  };

  const flrProfile = (value) => {
    close();
    return history.push(`/users/${value}`);
  };

  return ReactDOM.createPortal(
    <ModalBackdrop>
      <FollowContainer>
        <Box>
          <Heading>Follower</Heading>
          <Close onClick={() => close()}>X</Close>
        </Box>
        {following || remove ? (
          <LoadContainer>
            <RotatingLines
              strokeColor="grey"
              strokeWidth="5"
              animationDuration="0.75"
              width="20"
              visible={true}
            />
          </LoadContainer>
        ) : (
          <ScrollBar>
            {data?.seeFollowers?.followers.map((flwr) => (
              <FollowerContainer key={flwr?.user?.username}>
                <Avatar onClick={() => flrProfile(flwr?.user?.username)}>
                  <img src={flwr?.user?.avatar} />
                </Avatar>

                <TextContainer>
                  <Txt>{flwr?.user?.username}</Txt>
                  <FullName>{`${flwr?.user?.firstName} ${
                    flwr?.user?.lastName ? flwr?.user?.lastName : ""
                  }`}</FullName>
                </TextContainer>
                {isMe ? (
                  <RemoveButton onClick={() => discardFollower(flwr?.user?.id)}>
                    Remove
                  </RemoveButton>
                ) : (
                  <RemoveButton disabled={true}>Remove</RemoveButton>
                )}
              </FollowerContainer>
            ))}
          </ScrollBar>
        )}
      </FollowContainer>
    </ModalBackdrop>,
    document.getElementById("modalBackdrop")
  );
}
