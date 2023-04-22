import React from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { FatText } from "../components/shared";
import Button from "../components/Auth/Button";
import { useHistory } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";

export const SEE_FOLLOWING_QUERY = gql`
  query seeFollowing($username: String!) {
    seeFollowing(username: $username) {
      ok
      following {
        follower {
          username
          avatar
          firstName
          lastName
        }
      }
    }
  }
`;

const UNFOLLOW_USER_MUTATION = gql`
  mutation unfollowUser($username: String!) {
    unfollowUser(username: $username) {
      ok
      id
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
const FollowButton = styled(Button).attrs({
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
const FollowingContainer = styled.div`
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

export default function ShowFollowing({ close, name, isMe, userId }) {
  const history = useHistory();
  const { data, loading: see } = useQuery(SEE_FOLLOWING_QUERY, {
    variables: {
      username: name,
    },
    fetchPolicy: "cache-and-network",
  });

  const unfollowUserUpdate = (cache, result) => {
    const {
      data: {
        unfollowUser: { ok },
        id,
      },
    } = result;

    if (!ok) {
      return;
    }
    cache.modify({
      id: `User:${id}`,
      fields: {
        isFollowing() {
          return false;
        },
        totalFollowers(prev) {
          return prev - 1;
        },
      },
    });

    cache.evict({
      followerid: `Follower:${id}`,
      fields: {
        userId,
      },
    });

    cache.modify({
      id: `User:${name}`,
      fields: {
        totalFollowing(prev) {
          return prev - 1;
        },
      },
    });
  };

  const [unfollowUser, { loading: unfollow }] = useMutation(
    UNFOLLOW_USER_MUTATION,
    {
      update: unfollowUserUpdate,
    }
  );

  const discardFollower = (value) => {
    unfollowUser({
      variables: {
        username: value,
      },
    });
  };

  const flngProfile = (value) => {
    close();
    return history.push(`/users/${value}`);
  };

  return ReactDOM.createPortal(
    <ModalBackdrop>
      <FollowContainer>
        <Box>
          <Heading>Following</Heading>
          <Close onClick={() => close()}>X</Close>
        </Box>
        {see || unfollow ? (
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
            {data?.seeFollowing?.following?.map((flng) => (
              <FollowingContainer key={flng?.follower?.username}>
                <Avatar
                  onClick={() => flngProfile(`${flng?.follower?.username}`)}
                >
                  <img src={flng?.follower?.avatar} />
                </Avatar>
                <TextContainer>
                  <Txt>{flng?.follower?.username}</Txt>
                  <FullName>{`${flng?.follower?.firstName} ${
                    flng?.follower?.lastName ? flng?.follower?.lastName : ""
                  }`}</FullName>
                </TextContainer>
                {isMe ? (
                  <RemoveButton
                    onClick={() => discardFollower(flng.follower.username)}
                  >
                    unfollow
                  </RemoveButton>
                ) : (
                  <FollowButton disabled={true}>unfollow</FollowButton>
                )}
              </FollowingContainer>
            ))}
          </ScrollBar>
        )}
      </FollowContainer>
    </ModalBackdrop>,
    document.getElementById("modalBackdrop")
  );
}
